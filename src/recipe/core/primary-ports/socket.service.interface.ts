import { Server } from 'socket.io';
import { Recipe } from '../models/recipe';
import { Rating } from '../models/rating';

export const ISocketServiceProvider = 'ISocketServiceProvider'
export interface ISocketService{

  setServer(socket: Server)
  emitRecipeUpdateEvent(recipe: Recipe)
  emitRecipeCreateEvent(recipe: Recipe)
  emitRecipeDeleteEvent(recipe: Recipe)
  emitRecipeRatingUpdateEvent(recipe: Recipe, rating: Rating)

}
