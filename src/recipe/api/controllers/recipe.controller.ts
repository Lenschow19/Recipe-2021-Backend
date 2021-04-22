import { Body, Controller, Get, HttpException, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { MessageBody, WebSocketServer } from '@nestjs/websockets';
import { User } from '../../core/models/user';
import { Recipe } from '../../core/models/recipe';
import { IUserService, IUserServiceProvider } from '../../core/primary-ports/user.service.interface';
import { IRecipeService, IRecipeServiceProvider } from '../../core/primary-ports/recipe.service.interface';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';

@Controller('recipe')
export class RecipeController {

  constructor(@Inject(IUserServiceProvider) private userService: IUserService, @Inject(IRecipeServiceProvider) private recipeService: IRecipeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createRecipe(@MessageBody() recipe: Recipe){

    try
    {
      let foundUser: User = await this.userService.validateUser(recipe.user.ID);

      if(foundUser == null){
        throw new HttpException('Error loading user', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const addedRecipe = await this.recipeService.createRecipe(recipe);

      if(addedRecipe == null){
        throw new HttpException('Error saving recipe', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return true;
    }
    catch (e)
    {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }

  }

}
