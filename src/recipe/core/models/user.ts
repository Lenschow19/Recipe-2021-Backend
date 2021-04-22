import { IngredientEntry } from './ingredient-entry';

export interface User {
  ID: number
  username: string
  password: string
  salt: string
}
