import { Body, Controller, Get, HttpException, HttpStatus, Inject, Post, Query, UseGuards } from '@nestjs/common';
import { MessageBody, WebSocketServer } from '@nestjs/websockets';
import { User } from '../../core/models/user';
import { Recipe } from '../../core/models/recipe';
import { IUserService, IUserServiceProvider } from '../../core/primary-ports/user.service.interface';
import { IRecipeService, IRecipeServiceProvider } from '../../core/primary-ports/recipe.service.interface';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { Filter } from '../../core/models/filter';

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

  @Get('getRecipes')
  async getRecipes(@Query() filter: Filter){
    return this.recipeService.getRecipes(filter);
  }

  @Get('recipeCategories')
  async getRecipeCategories(){
    return await this.recipeService.getRecipeCategories();
  }

  @Get('getById')
  async getRecipeByID(@MessageBody() data: any){
    try
    {
      const recipe: Recipe = await this.recipeService.getRecipeById(data.ID);
      if(recipe == null)
      {
        throw new Error('Error loading recipe with ID: ' + data.ID);
      }

      return recipe;

    }
    catch (e)
    {
      throw new HttpException('Error loading recipe with ID: ' + data.ID, HttpStatus.BAD_REQUEST);
    }
  }

}
