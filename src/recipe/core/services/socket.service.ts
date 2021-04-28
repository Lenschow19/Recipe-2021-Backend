import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { ISocketService } from '../primary-ports/socket.service.interface';
import { MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Recipe } from '../models/recipe';

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

}
