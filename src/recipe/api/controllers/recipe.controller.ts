import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessageBody, WebSocketServer } from '@nestjs/websockets';
import { User } from '../../core/models/user';
import { Recipe } from '../../core/models/recipe';
import { IUserService, IUserServiceProvider } from '../../core/primary-ports/user.service.interface';
import { IRecipeService, IRecipeServiceProvider } from '../../core/primary-ports/recipe.service.interface';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { Filter } from '../../core/models/filter';
import { query } from 'express';
import { RecipeGetDto } from '../dtos/recipe.get.dto';
import { RecipeDeleteDto } from '../dtos/recipe.delete.dto';

@Controller('recipe')
export class RecipeController {

  @WebSocketServer() server;

  constructor(@Inject(IUserServiceProvider) private userService: IUserService, @Inject(IRecipeServiceProvider) private recipeService: IRecipeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createRecipe(@MessageBody() recipe: Recipe){

    try
    {
      let foundUser: User = await this.userService.getUserById(recipe.user.ID);

      if(foundUser == null || foundUser == undefined){
        throw new HttpException('Error loading user', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const addedRecipe = await this.recipeService.createRecipe(recipe);


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

  @UseGuards(JwtAuthGuard)
  @Get('getPersonalRecipes')
  async getPersonalRecipes(@Query() filter: Filter){
    return this.recipeService.getRecipes(filter);
  }

  @Get('recipeCategories')
  async getRecipeCategories(){
    return await this.recipeService.getRecipeCategories();
  }

  @UseGuards(JwtAuthGuard)
  @Post('getPersonalById')
  async getPersonalByID(@MessageBody() recipeGetDTO: RecipeGetDto){
    try
    {
      return await this.recipeService.getRecipeById(recipeGetDTO);
    }
    catch (e) {throw new HttpException('Error loading recipe with ID: ' + recipeGetDTO.recipeID, HttpStatus.NOT_FOUND);}
  }

  @Post('getById')
  async getByID(@MessageBody() recipeGetDTO: RecipeGetDto){
    try
    {
      return await this.recipeService.getRecipeById(recipeGetDTO);
    }
    catch (e) {throw new HttpException('Error loading recipe with ID: ' + recipeGetDTO.recipeID, HttpStatus.NOT_FOUND);}
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateRecipe(@MessageBody() recipe: Recipe){
    try
    {
     return await this.recipeService.updateRecipe(recipe);
    }
    catch (e)
    {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('deleteRecipe')
  async deleteRecipe(@MessageBody() recipeDeleteDTO: RecipeDeleteDto){
    try
    {
      const deleted = await this.recipeService.deleteRecipe(recipeDeleteDTO);
      if(!deleted){throw new Error('Error deleting recipe with ID ' + recipeDeleteDTO.recipeID)}
      return deleted;
    }
    catch (e)
    {
      console.log(e.message);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
