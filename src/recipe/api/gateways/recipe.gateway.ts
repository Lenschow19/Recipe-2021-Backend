import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { IRecipeService, IRecipeServiceProvider } from '../../core/primary-ports/recipe.service.interface';
import { Recipe } from '../../core/models/recipe';
import { ListenDetailsDto } from '../dtos/listen.details.dto';
import { Server, Socket } from 'socket.io';
import { SocketService } from '../../core/services/socket.service';
import { IUserService, IUserServiceProvider } from '../../core/primary-ports/user.service.interface';
import { ISocketService, ISocketServiceProvider } from '../../core/primary-ports/socket.service.interface';

@WebSocketGateway()
export class RecipeGateway implements OnGatewayInit{

  @WebSocketServer() server: Server;

  constructor(@Inject(ISocketServiceProvider) private socketService: ISocketService) {}

  afterInit(server: Server){
    this.socketService.setServer(server);
  }

  // @SubscribeMessage('updateRecipe')
  // async handleUpdateEvent(@MessageBody() recipe: Recipe) {
  //   this.server.emit('recipeUpdated', recipe);
  // }

  // @SubscribeMessage('createRecipe')
  // async handleCreateEvent(@MessageBody() recipe: Recipe) {
  //   this.server.emit('recipeCreated', recipe);
  // }


}
