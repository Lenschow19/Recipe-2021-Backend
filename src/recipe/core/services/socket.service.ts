import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { ISocketService } from '../primary-ports/socket.service.interface';
import { Recipe } from '../models/recipe';
import { Rating } from '../models/rating';

@Injectable()
export class SocketService implements ISocketService{

  public server: Server = null;

  constructor() {}

  setServer(socket: Server) {
    this.server = socket;
  }

  emitRecipeUpdateEvent(recipe: Recipe) {
    this.server.emit('recipeUpdated', recipe);
  }

  emitRecipeCreateEvent(recipe: Recipe) {
    this.server.emit('recipeCreated', recipe);
  }

  emitRecipeDeleteEvent(recipe: Recipe) {
    this.server.emit('recipeDeleted', recipe);
  }

  emitRecipeRatingUpdateEvent(recipe: Recipe, rating: Rating) {
    this.server.emit('recipeUpdated', recipe);
    this.server.emit('recipeRatingUpdated', rating);
  }

}
