import { Server } from 'socket.io';
import { Recipe } from '../models/recipe';
import { Rating } from '../models/rating';

export const ISocketServiceProvider = 'ISocketServiceProvider'
export interface ISocketService{

  setServer(socket: Server)
  emitRecipeCreateEvent(recipe: Recipe)
  emitRecipeUpdateEvent(recipe: Recipe)
  emitRecipeRatingUpdateEvent(recipe: Recipe, rating: Rating)
  emitRecipeDeleteEvent(recipe: Recipe)
}
