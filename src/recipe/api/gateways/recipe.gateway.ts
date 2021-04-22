import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { IRecipeService, IRecipeServiceProvider } from '../../core/primary-ports/recipe.service.interface';
import { Recipe } from '../../core/models/recipe';

@WebSocketGateway()
export class RecipeGateway {

  @WebSocketServer() server;

  constructor(@Inject(IRecipeServiceProvider) private recipeService: IRecipeService) {}

  @SubscribeMessage('createStock')
  async handleCreateEvent(@MessageBody() recipe: Recipe) {




  }
}
