import { Server } from 'socket.io';
import { Recipe } from '../models/recipe';
import { RatingDto } from '../../api/dtos/rating.dto';
import { FavoriteDto } from '../../api/dtos/favorite.dto';

export const ISocketServiceProvider = 'ISocketServiceProvider'
export interface ISocketService{

  setServer(socket: Server)
  emitRecipeCreateEvent(recipe: Recipe)
  emitRecipeUpdateEvent(recipe: Recipe)
  emitRecipeRatingUpdateEvent(recipe: Recipe, rating: RatingDto)
  emitRecipeDeleteEvent(recipe: Recipe)
  emitRecipeFavoriteUpdateEvent(favoriteDTO: FavoriteDto)
}
