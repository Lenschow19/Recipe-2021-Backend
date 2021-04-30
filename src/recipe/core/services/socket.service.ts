import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { ISocketService } from '../primary-ports/socket.service.interface';
import { Recipe } from '../models/recipe';
import { Rating } from '../models/rating';
import { FavoriteDto } from '../../api/dtos/favorite.dto';

@Injectable()
export class SocketService implements ISocketService{

  public server: Server = null;

  constructor() {}

  setServer(socket: Server) {
    this.server = socket;
  }

  emitRecipeCreateEvent(recipe: Recipe) {
    this.server.emit('recipeCreated', recipe);
  }

  emitRecipeUpdateEvent(recipe: Recipe) {
    this.server.emit('recipeUpdated', recipe);
  }

  emitRecipeRatingUpdateEvent(recipe: Recipe, rating: Rating) {
    this.server.emit('recipeUpdated', recipe);
    this.server.emit('recipeRatingUpdated', rating);
  }

  emitRecipeDeleteEvent(recipe: Recipe) {
    this.server.emit('recipeDeleted', recipe);
  }

  emitRecipeFavoriteUpdateEvent(favoriteDTO: FavoriteDto) {
    this.server.to(`${favoriteDTO.userID}`).emit('recipeFavoriteUpdate', favoriteDTO);
  }
}
