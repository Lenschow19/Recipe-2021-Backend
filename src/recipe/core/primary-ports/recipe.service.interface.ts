import { Recipe } from '../models/recipe';

export const IRecipeServiceProvider = 'IRecipeServiceProvider'
export interface IRecipeService{

  createRecipe(recipe: Recipe): Promise<boolean>

}
