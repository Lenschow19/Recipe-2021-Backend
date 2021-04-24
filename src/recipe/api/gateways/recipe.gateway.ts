import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { IRecipeService, IRecipeServiceProvider } from '../../core/primary-ports/recipe.service.interface';
import { Recipe } from '../../core/models/recipe';
import { ListenDetailsDto } from '../dtos/listen.details.dto';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class RecipeGateway {

  recipeDetailsRoom: string = 'details'

  @WebSocketServer() server;

  constructor(@Inject(IRecipeServiceProvider) private recipeService: IRecipeService) {}

  @SubscribeMessage('updateRecipe')
  async handleUpdateEvent(@MessageBody() recipe: Recipe) {

    //Emit to details for Recipe
    this.server.in(`${this.recipeDetailsRoom}${recipe.ID}`).emit('recipeUpdated', recipe);

  }

  @SubscribeMessage('joinDetailsRoom')
  async joinDetailsRoom(@MessageBody() listenDetailsDTO: ListenDetailsDto, @ConnectedSocket() client: Socket) {
    console.log(listenDetailsDTO);
    client.leaveAll();
    client.join(`${listenDetailsDTO.room}${listenDetailsDTO.ID}`);
  }
}
