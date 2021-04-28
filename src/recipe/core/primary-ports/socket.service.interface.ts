import { Server } from 'socket.io';
import { Recipe } from '../models/recipe';

export const ISocketServiceProvider = 'ISocketServiceProvider'
export interface ISocketService{

  setServer(socket: Server)
  emitRecipeUpdateEvent(recipe: Recipe)
  emitRecipeCreateEvent(recipe: Recipe)
  emitRecipeDeleteEvent(recipe: Recipe)

}
