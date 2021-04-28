import { Recipe } from '../models/recipe';
import { Filter } from '../models/filter';
import { FilterList } from '../models/filterList';
import { Category } from '../models/category';
import { RecipeGetDto } from '../../api/dtos/recipe.get.dto';
import { RecipeDeleteDto } from '../../api/dtos/recipe.delete.dto';
import { Rating } from '../models/rating';

export const IRecipeServiceProvider = 'IRecipeServiceProvider'
export interface IRecipeService{

  createRecipe(recipe: Recipe): Promise<Recipe>
  getRecipes(filter: Filter): Promise<FilterList<Recipe>>
  getRecipeCategories(): Promise<Category>
  getRecipeById(recipeID: number, userIDOwner?: number, userIDRating?: number): Promise<Recipe>
  updateRecipe(recipe: Recipe): Promise<Recipe>
  deleteRecipe(recipeID: number, userID: number): Promise<boolean>

  createRating(rating: Rating): Promise<Recipe>
}
