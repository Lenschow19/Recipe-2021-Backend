import { Body, Controller, Get, HttpException, HttpStatus, Inject, Post, Put, Query, UseGuards } from '@nestjs/common';
import { MessageBody, WebSocketServer } from '@nestjs/websockets';
import { User } from '../../core/models/user';
import { Recipe } from '../../core/models/recipe';
import { IUserService, IUserServiceProvider } from '../../core/primary-ports/user.service.interface';
import { IRecipeService, IRecipeServiceProvider } from '../../core/primary-ports/recipe.service.interface';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { Filter } from '../../core/models/filter';
import { query } from 'express';
import { RecipeGetDto } from '../dtos/recipe.get.dto';

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

      return addedRecipe;
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

  // @UseGuards(JwtAuthGuard)
  @Post('getPersonalById')
  async getPersonalByID(@MessageBody() recipeGetDTO: RecipeGetDto){
    try
    {
      const recipe: Recipe = await this.recipeService.getRecipeById(recipeGetDTO);
      if(recipe == null) {throw new HttpException(`Could not find recipe with ID: ${recipeGetDTO.recipeID} for this user`, HttpStatus.NOT_FOUND);}
      return recipe;
    }
    catch (e) {throw new HttpException('Error loading recipe with ID: ' + recipeGetDTO.recipeID, HttpStatus.INTERNAL_SERVER_ERROR);}
  }

  @Post('getById')
  async getByID(@MessageBody() recipeGetDTO: RecipeGetDto){
    try
    {
      const recipe: Recipe = await this.recipeService.getRecipeById(recipeGetDTO);
      if(recipe == null) {throw new HttpException('Error loading recipe with ID: ' + recipeGetDTO.recipeID, HttpStatus.NOT_FOUND);}
      return recipe;
    }
    catch (e) {throw new HttpException('Error loading recipe with ID: ' + recipeGetDTO.recipeID, HttpStatus.INTERNAL_SERVER_ERROR);}
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateRecipe(@MessageBody() recipe: Recipe){
    try
    {
      const updatedRecipe = await this.recipeService.updateRecipe(recipe);
      if(updatedRecipe == null)
      {
        throw new Error('Error updating recipe with ID: ' + recipe.ID);
      }
      return updatedRecipe;
    }
    catch (e)
    {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

}
