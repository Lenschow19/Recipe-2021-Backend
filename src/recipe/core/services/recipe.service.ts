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

@Injectable()
export class RecipeService implements IRecipeService{

  constructor(@InjectRepository(RecipeEntity) private recipeRepository: Repository<RecipeEntity>,
              @InjectRepository(IngredientEntryEntity) private ingredientRepository: Repository<IngredientEntryEntity>,
              @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>){}

  async createRecipe(recipe: Recipe): Promise<boolean> {

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

    const ingredients = await this.ingredientRepository.create(recipe.ingredientEntries);
    await this.ingredientRepository.save(ingredients);

    recipe.ingredientEntries = ingredients;
    const newRecipe = await this.recipeRepository.create(recipe);
    await this.recipeRepository.save(newRecipe);

    return true;
  }

  async getRecipes(filter: Filter): Promise<FilterList<Recipe>> {

    let qb = this.recipeRepository.createQueryBuilder("recipe");

    if(filter.name != null && filter.name !== '')
    {
      qb.where(`title ILIKE :name`, { name: `%${filter.name}%` });
    }

    if(filter.sorting != null && filter.sorting === 'asc')
    {
      if(filter.sortingType != null && filter.sortingType === 'ALF')
      {
        qb.orderBy("title", "ASC");
      }
    }

    else if(filter.sorting != null && filter.sorting === 'desc')
    {
      if(filter.sortingType != null && filter.sortingType === 'ALF')
      {
        qb.orderBy("title", "DESC");
      }
    }

    qb.take(filter.itemsPrPage);
    qb.skip((filter.currentPage - 1) * filter.itemsPrPage);
    const [result, total] = await qb.getManyAndCount();
    let recipeList: FilterList<Recipe> = {totalItems: total, list: JSON.parse(JSON.stringify(result))}
    return recipeList;
  }

  async getRecipeCategories(): Promise<Category>{
    const categories: CategoryEntity[] = await this.categoryRepository.find();
    return JSON.parse(JSON.stringify(categories));
  }

  async getRecipeById(ID: number): Promise<Recipe> {

    if(ID <= 0)
    {
      throw new Error('Incorrect ID entered');
    }

    let qb = this.recipeRepository.createQueryBuilder("recipe");
    qb.leftJoinAndSelect('recipe.user', 'user');
    qb.leftJoinAndSelect('recipe.ingredientEntries', 'ingredientEntries');
    qb.leftJoinAndSelect('recipe.category', 'category');
    qb.where(`recipe.ID = :ID`, { ID: `${ID}`});

    const recipe: RecipeEntity = await qb.getOne();
    return JSON.parse(JSON.stringify(recipe));
  }

}
