import { Body, Controller, Get, HttpException, HttpStatus, Inject, Post } from '@nestjs/common';
import { MessageBody, WebSocketServer } from '@nestjs/websockets';
import { User } from '../../core/models/user';
import { Recipe } from '../../core/models/recipe';
import { IUserService, IUserServiceProvider } from '../../core/primary-ports/user.service.interface';
import { IRecipeService, IRecipeServiceProvider } from '../../core/primary-ports/recipe.service.interface';

@Controller('recipe')
export class RecipeController {

  constructor(@Inject(IUserServiceProvider) private userService: IUserService, @Inject(IRecipeServiceProvider) private recipeService: IRecipeService) {}

  @Post('create')
  async createRecipe(@MessageBody() recipe: Recipe){

    // console.log(recipe);

    try
    {
      let foundUser: User = await this.userService.validateUser(recipe.user.ID);

      if(foundUser == null){
        throw new HttpException('Error loading user', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const addedRecipe = await this.recipeService.createRecipe(recipe);
      return true;
    }
    catch (e)
    {
      console.log(e);
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }

  }

}
