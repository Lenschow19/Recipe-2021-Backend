import { Recipe } from '../../core/models/recipe';

export interface RecipeDeleteDto{
  recipe: Recipe
  userID: number
}
