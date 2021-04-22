import { IngredientEntry } from './ingredient-entry';
import { User } from './user';

export interface Recipe {
  ID: number
  title: string
  description: string
  ingredientEntries: IngredientEntry[]
  preparations: string
  imageURL: string
  user?: User
}
