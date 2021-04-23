import { Recipe } from '../models/recipe';
import { Filter } from '../models/filter';
import { FilterList } from '../models/filterList';
import { Category } from '../models/category';
import { RecipeGetDto } from '../../api/dtos/recipe.get.dto';

export const IRecipeServiceProvider = 'IRecipeServiceProvider'
export interface IRecipeService{

  createRecipe(recipe: Recipe): Promise<boolean>
  getRecipes(filter: Filter): Promise<FilterList<Recipe>>
  getRecipeCategories(): Promise<Category>
  getRecipeById(recipeGetDTO: RecipeGetDto): Promise<Recipe>

}
