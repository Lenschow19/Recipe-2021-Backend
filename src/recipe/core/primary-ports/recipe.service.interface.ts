import { Recipe } from '../models/recipe';
import { Filter } from '../models/filter';
import { FilterList } from '../models/filterList';
import { Category } from '../models/category';
import { Rating } from '../models/rating';
import { FavoriteDto } from '../../api/dtos/favorite.dto';

export const IRecipeServiceProvider = 'IRecipeServiceProvider'
export interface IRecipeService{

  createRecipe(recipe: Recipe): Promise<Recipe>
  getRecipes(filter: Filter): Promise<FilterList<Recipe>>
  getRecipeById(recipeID: number, userIDOwner?: number, userIDRating?: number): Promise<Recipe>
  updateRecipe(recipe: Recipe): Promise<Recipe>
  deleteRecipe(recipeID: number, userID: number): Promise<boolean>

  createRating(rating: Rating): Promise<Recipe>

  favoriteRecipe(favoriteDTO: FavoriteDto): Promise<boolean>
  unfavoriteRecipe(favoriteDTO: FavoriteDto): Promise<boolean>

  getRecipeCategories(): Promise<Category>
  validateRecipe(recipe: Recipe)
}
