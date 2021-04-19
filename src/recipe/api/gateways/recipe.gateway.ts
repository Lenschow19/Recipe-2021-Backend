import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { IRecipeService, IRecipeServiceProvider } from '../../core/primary-ports/recipe.service.interface';

@WebSocketGateway()
export class RecipeGateway {

  @WebSocketServer() server;

  constructor(@Inject(IRecipeServiceProvider) private recipeService: IRecipeService) {}

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
