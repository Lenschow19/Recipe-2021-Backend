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
import { RatingDto } from '../../api/dtos/rating.dto';
import { RatingEntity } from '../../infrastructure/data-source/postgres/entities/rating.entity';
import { FavoriteEntity } from '../../infrastructure/data-source/postgres/entities/favorite.entity';
import { FavoriteDto } from '../../api/dtos/favorite.dto';

@Injectable()
export class RecipeService implements IRecipeService{

  constructor(@InjectRepository(RecipeEntity) private recipeRepository: Repository<RecipeEntity>,
              @InjectRepository(IngredientEntryEntity) private ingredientRepository: Repository<IngredientEntryEntity>,
              @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>,
              @InjectRepository(RatingEntity) private ratingRepository: Repository<RatingEntity>,
              @InjectRepository(FavoriteEntity) private favoriteRepository: Repository<FavoriteEntity>){}

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
    qb.addSelect('COALESCE(CAST(CAST(SUM(ratings.rating) AS DOUBLE PRECISION)/CAST(COUNT(ratings.rating) AS DOUBLE PRECISION) AS NUMERIC(5,1)),0)', 'average_rating').groupBy('recipe.ID');

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

    if(filter.userIDFavorite != null)
    {
      if(filter.userIDFavorite <= 0){throw new Error('Invalid user ID entered');}
      qb.leftJoin(qb => qb.select("favorite.isFavorite, favorite.recipeID, favorite.userID").from(FavoriteEntity, 'favorite').where('favorite.userID = :userIDFavorite', {userIDFavorite: `${filter.userIDFavorite}`}), 'favorites', '"favorites"."recipeID" = recipe.ID').addGroupBy('"favorites"."recipeID", "favorites"."userID", "favorites"."isFavorite"');
      qb.addSelect('COALESCE("isFavorite", false)', 'isFavorite');
    }

    const showFavorites: string = String(filter.showFavorites);

    if(showFavorites === 'true')
    {
      qb.andWhere(`"isFavorite" = true`);
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
      preparations: recipeEntityRaw.recipe_preparations, imageURL: recipeEntityRaw.recipe_imageURL, averageRating: recipeEntityRaw.average_rating, category: null, ingredientEntries: null, user: null, personalRating: 0, isFavorite: (recipeEntityRaw.isFavorite != null) ? recipeEntityRaw.isFavorite : false}});

    const filterList: FilterList<Recipe> = {list: resultConverted, totalItems: count};
    return filterList;
  }

  async getRecipeById(recipeID: number, userIDOwner?: number, userIDRating?: number): Promise<Recipe> {

    if(recipeID <= 0)
    {
      throw new Error('Incorrect recipe ID entered');
    }

    let qb = this.recipeRepository.createQueryBuilder("recipe");
    qb.leftJoinAndSelect('recipe.user', 'user');
    qb.leftJoinAndSelect('recipe.ingredientEntries', 'ingredientEntries')
    qb.leftJoinAndSelect('recipe.category', 'category')
    qb.leftJoin('recipe.ratings', 'ratings');
    qb.addSelect('COALESCE(CAST(CAST(SUM(ratings.rating) AS DOUBLE PRECISION)/CAST(COUNT(ratings.rating) AS DOUBLE PRECISION) AS NUMERIC(5,1)),0)', 'average_rating')
    qb.andWhere(`recipe.ID = :RecipeID`, { RecipeID: `${recipeID}`});
    qb.addGroupBy('user.ID, ingredientEntries.ID, category.ID, recipe.ID')

    if(userIDOwner !== undefined && userIDOwner !== null)
    {
      if(userIDOwner <= 0)
      {
        throw new Error('Incorrect user ID entered');
      }

      qb.andWhere(`user.ID = :UserID`, { UserID: `${userIDOwner}`});
    }

    if(userIDRating !== undefined && userIDRating !== null)
    {
      if(userIDRating <= 0) {throw new Error('Incorrect user ID entered');}

      qb.leftJoin(qb => qb.select("favorite.isFavorite, favorite.recipeID, favorite.userID").from(FavoriteEntity, 'favorite').where('favorite.userID = :userIDFavorite', {userIDFavorite: `${userIDRating}`}), 'favorites', '"favorites"."recipeID" = recipe.ID').addGroupBy('"favorites"."recipeID", "favorites"."userID", "favorites"."isFavorite"');
      qb.addSelect('COALESCE("isFavorite", false)', 'isFavorite');

      qb.leftJoin(qb => qb.select("ratingPersonal.rating as personal_rating, ratingPersonal.recipeID, ratingPersonal.userID").from(RatingEntity, 'ratingPersonal').where('ratingPersonal.userID = :userID', {userID: `${userIDRating}`}), 'ratingsPersonal', '"ratingsPersonal"."recipeID" = recipe.ID').addGroupBy('"ratingsPersonal"."recipeID", "ratingsPersonal"."userID", "ratingsPersonal"."personal_rating"');
      qb.addSelect('COALESCE("personal_rating", 0)', 'personal_rating');
    }

    const recipe: RecipeEntity = await qb.getOne();
    if(recipe == null || recipe == undefined){throw new Error('Error loading this recipe');}
    const recipeConverted: Recipe = JSON.parse(JSON.stringify(recipe));
    const recipeRaw: any = await qb.getRawOne();

    recipeConverted.user.salt = '';
    recipeConverted.user.password = '';
    recipeConverted.isFavorite = (recipeRaw.isFavorite != null) ? recipeRaw.isFavorite : false;
    recipeConverted.averageRating = recipeRaw.average_rating;
    recipeConverted.personalRating = (recipeRaw.personal_rating != null) ? recipeRaw.personal_rating : 0;

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

  async deleteRecipe(recipeID: number, userID: number): Promise<boolean> {

    const recipe = await this.recipeRepository.createQueryBuilder().delete()
      .where("ID = :recipeID", { recipeID: `${recipeID}`})
      .andWhere("userID = :userID", {userID: `${userID}`})
      .execute();

    if(recipe.affected){return true;}
    return false;
  }

  async getRecipeCategories(): Promise<Category>{
    const categories: CategoryEntity[] = await this.categoryRepository.find();
    return JSON.parse(JSON.stringify(categories));
  }

  async favoriteRecipe(favoriteDTO: FavoriteDto): Promise<boolean> {

    if(favoriteDTO.userID <= 0)
    {
      throw new Error('Invalid user ID received');
    }
    if(favoriteDTO.recipeID <= 0)
    {
      throw new Error('Invalid recipe ID received');
    }

    const favoriteEntity = this.favoriteRepository.create();
    favoriteEntity.user = JSON.parse(JSON.stringify({ID: favoriteDTO.userID}));
    favoriteEntity.recipe = JSON.parse(JSON.stringify({ID: favoriteDTO.recipeID}));
    favoriteEntity.isFavorite = favoriteDTO.favorite;
    await this.favoriteRepository.save(favoriteEntity);
    return true;
  }

  async unfavoriteRecipe(favoriteDTO: FavoriteDto): Promise<boolean> {

    if(favoriteDTO.userID <= 0)
    {
      throw new Error('Invalid user ID received');
    }
    if(favoriteDTO.recipeID <= 0)
    {
      throw new Error('Invalid recipe ID received');
    }

    const favoriteDeleted = await this.favoriteRepository.createQueryBuilder().delete()
      .where("recipeID = :recipeID AND userID = :userID", { recipeID: `${favoriteDTO.recipeID}`, userID: `${favoriteDTO.userID}`})
      .execute();

    if(favoriteDeleted.affected){return true;}
    return false;
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
}
