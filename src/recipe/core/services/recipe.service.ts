import { Injectable } from '@nestjs/common';
import { IRecipeService } from '../primary-ports/recipe.service.interface';
import { Recipe } from '../models/recipe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeEntity } from '../../infrastructure/data-source/postgres/entities/recipe.entity';
import { IngredientEntryEntity } from '../../infrastructure/data-source/postgres/entities/ingredient-entry.entity';
import { Filter } from '../models/filter';
import { FilterList } from '../models/filterList';
import { Category } from '../models/category';
import { CategoryEntity } from '../../infrastructure/data-source/postgres/entities/category.entity';
import { RecipeGetDto } from '../../api/dtos/recipe.get.dto';
import { RecipeDeleteDto } from '../../api/dtos/recipe.delete.dto';
import { Rating } from '../models/rating';
import { RatingEntity } from '../../infrastructure/data-source/postgres/entities/rating.entity';

@Injectable()
export class RecipeService implements IRecipeService{

  constructor(@InjectRepository(RecipeEntity) private recipeRepository: Repository<RecipeEntity>,
              @InjectRepository(IngredientEntryEntity) private ingredientRepository: Repository<IngredientEntryEntity>,
              @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>,
              @InjectRepository(RatingEntity) private ratingRepository: Repository<RatingEntity>){}

  async createRecipe(recipe: Recipe): Promise<Recipe> {

    await this.validateRecipe(recipe);
    const ingredients = await this.ingredientRepository.create(recipe.ingredientEntries);
    await this.ingredientRepository.save(ingredients);

    recipe.ingredientEntries = ingredients;
    const newRecipe = await this.recipeRepository.create(recipe);
    await this.recipeRepository.save(newRecipe);

    if(newRecipe == null || newRecipe == undefined){throw new Error('Error saving recipe')}

    const createdRecipe: Recipe = JSON.parse(JSON.stringify(newRecipe));
    createdRecipe.averageRating = 0;
    return createdRecipe;
  }

  async getRecipes(filter: Filter): Promise<FilterList<Recipe>> {

    let qb = this.recipeRepository.createQueryBuilder("recipe");
    qb.leftJoin('recipe.ratings', 'ratings');
    qb.addSelect('CAST(CAST(SUM(ratings.rating) AS DOUBLE PRECISION)/CAST(COUNT(ratings.rating) AS DOUBLE PRECISION) AS NUMERIC(5,2))', 'average_rating').groupBy('recipe.ID');

    if(filter.name != null && filter.name !== '')
    {
      qb.andWhere(`title ILIKE :name`, { name: `%${filter.name}%` });
    }

    if(filter.category != null && filter.category > 0)
    {
      qb.andWhere(`recipe.categoryID = :categoryID`, { categoryID: `${filter.category}` });
    }

    if(filter.userID != null)
    {
      if(filter.userID <= 0) {throw new Error('Invalid user ID entered');}
      qb.andWhere(`recipe.userID = :userID`, {userID: `${filter.userID}`});
    }

    if(filter.sorting != null && filter.sorting === 'ASC' || filter.sorting != null && filter.sorting === 'DESC')
    {
      if(filter.sortingType != null && filter.sortingType === 'ALF')
      {
        qb.orderBy('recipe.title', filter.sorting);
      }
      if(filter.sortingType != null && filter.sortingType === 'ADDED')
      {
        qb.orderBy('recipe.ID', filter.sorting);
      }
      if(filter.sortingType != null && filter.sortingType === 'RATING' && filter.sorting === 'ASC')
      {
        qb.orderBy('average_rating', 'ASC', 'NULLS FIRST');
      }
      if(filter.sortingType != null && filter.sortingType === 'RATING' && filter.sorting === 'DESC')
      {
        qb.orderBy('average_rating', 'DESC', 'NULLS LAST');
      }
    }

    qb.offset((filter.currentPage - 1) * filter.itemsPrPage);
    qb.limit(filter.itemsPrPage);

    const result = await qb.getRawMany();
    const count = await qb.getCount();

    const resultConverted: Recipe[] = result.map((recipeEntityRaw) => {return {ID: recipeEntityRaw.recipe_ID, title: recipeEntityRaw.recipe_title, description: recipeEntityRaw.recipe_description,
      preparations: recipeEntityRaw.recipe_preparations, imageURL: recipeEntityRaw.recipe_imageURL, averageRating: (recipeEntityRaw.average_rating != null) ? recipeEntityRaw.average_rating : 0, category: null, ingredientEntries: null, user: null, personalRating: 0}});

    const filterList: FilterList<Recipe> = {list: resultConverted, totalItems: count};
    return filterList;
  }

  async getRecipeCategories(): Promise<Category>{
    const categories: CategoryEntity[] = await this.categoryRepository.find();
    return JSON.parse(JSON.stringify(categories));
  }

  async getRecipeById(recipeID: number, userIDOwner?: number, userIDRating?: number): Promise<Recipe> {

    if(recipeID <= 0)
    {
      throw new Error('Incorrect recipe ID entered');
    }

    let qb = this.recipeRepository.createQueryBuilder("recipe");
    qb.leftJoinAndSelect('recipe.user', 'user');
    qb.leftJoinAndSelect('recipe.ingredientEntries', 'ingredientEntries');
    qb.leftJoinAndSelect('recipe.category', 'category');
    qb.andWhere(`recipe.ID = :RecipeID`, { RecipeID: `${recipeID}`});

    if(userIDOwner !== undefined && userIDOwner !== null)
    {
      if(userIDOwner <= 0)
      {
        throw new Error('Incorrect user ID entered');
      }

      qb.andWhere(`user.ID = :UserID`, { UserID: `${userIDOwner}`});
    }

    const recipe: RecipeEntity = await qb.getOne();
    recipe.user.salt = '';
    recipe.user.password = '';
    if(recipe == null || recipe == undefined){throw new Error('Error loading this recipe');}

    const recipeConverted: Recipe = JSON.parse(JSON.stringify(recipe));

    const averageRating = await this.ratingRepository.createQueryBuilder('rating')
      .select('CAST(SUM(rating.rating) AS DOUBLE PRECISION)/CAST(COUNT(rating) AS DOUBLE PRECISION)', 'average_rating').where('rating.recipeID = :recipeID', {recipeID: `${recipeID}`})
      .getRawOne();



    recipeConverted.averageRating = (averageRating.average_rating != null) ? averageRating.average_rating : 0;

    if(userIDRating !== undefined && userIDRating !== null)
    {
      if(userIDRating <= 0)
      {
        throw new Error('Incorrect user ID entered');
      }

      const userRating = await this.ratingRepository.createQueryBuilder('rating')
        .select('rating.rating', 'user_rating').where('rating.userID = :userID AND rating.recipeID = :recipeID', {userID: `${userIDRating}`, recipeID: `${recipeID}`})
        .getRawOne();

      recipeConverted.personalRating = (userRating != null && userRating != undefined) ? userRating.user_rating : 0;
    }

    return recipeConverted;
  }

  async updateRecipe(recipe: Recipe): Promise<Recipe> {
    await this.validateRecipe(recipe);

    await this.ingredientRepository.createQueryBuilder().delete()
      .where("recipeID = :ID", { ID: `${recipe.ID}`}).execute();

    const ingredients = await this.ingredientRepository.create(recipe.ingredientEntries);
    await this.ingredientRepository.save(ingredients);

    recipe.ingredientEntries = ingredients;
    const updatedRecipe = await this.recipeRepository.save(recipe);

    if(updatedRecipe == null || updatedRecipe == undefined){throw new Error('Error updating recipe')}
    return JSON.parse(JSON.stringify(updatedRecipe));
  }

  async validateRecipe(recipe: Recipe){
    if(recipe.title.length < 5 || recipe.title.length > 32){
      throw new Error('Recipe name must be between 5 and 32 characters');
    }

    if(recipe.description.length < 10 || recipe.description.length > 1000){
      throw new Error('Recipe description must be between 10 and 1000 characters');
    }

    if(recipe.imageURL === ''){
      recipe.imageURL = 'https://firebasestorage.googleapis.com/v0/b/eb-sdm3.appspot.com/o/NoImage.png?alt=media&token=9f213b80-6356-4f8e-83b6-301936912a6e';
    }

    if(recipe.ingredientEntries.length < 1){
      throw new Error('Recipe requires ingredient(s)');
    }

    if(recipe.preparations.length < 1 || recipe.description.length > 1000){
      throw new Error('Recipe preparation description must be between 1 and 1000 characters');
    }

    if(recipe.category == null){
      throw new Error('Recipe must have a category');
    }

    const category = await this.categoryRepository.findOne(recipe.category.ID)
    if(category == null)
    {
      throw new Error('No such category found. Please refresh page.');
    }
  }

  async deleteRecipe(recipeID: number, userID: number): Promise<boolean> {

    const recipe = await this.recipeRepository.createQueryBuilder().delete()
      .where("ID = :recipeID", { recipeID: `${recipeID}`})
      .andWhere("userID = :userID", {userID: `${userID}`})
      .execute();

    if(recipe.affected){return true;}
    return false;
  }

  async createRating(rating: Rating): Promise<Recipe> {
    const ratingEntity = this.ratingRepository.create(rating);
    ratingEntity.user = JSON.parse(JSON.stringify({ID: rating.userID}));
    ratingEntity.recipe = JSON.parse(JSON.stringify({ID: rating.recipeID}));
    await this.ratingRepository.save(ratingEntity);
    return this.getRecipeById(rating.recipeID);
  }

}
