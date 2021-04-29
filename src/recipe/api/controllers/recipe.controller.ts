import {
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
import { MessageBody } from '@nestjs/websockets';
import { User } from '../../core/models/user';
import { Recipe } from '../../core/models/recipe';
import { IUserService, IUserServiceProvider } from '../../core/primary-ports/user.service.interface';
import { IRecipeService, IRecipeServiceProvider } from '../../core/primary-ports/recipe.service.interface';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { Filter } from '../../core/models/filter';
import { RecipeGetDto } from '../dtos/recipe.get.dto';
import { RecipeDeleteDto } from '../dtos/recipe.delete.dto';
import { ISocketService, ISocketServiceProvider } from '../../core/primary-ports/socket.service.interface';
import { Rating } from '../../core/models/rating';
import { FavoriteDto } from '../dtos/favorite.dto';

@Controller('recipe')
export class RecipeController {

  constructor(@Inject(IUserServiceProvider) private userService: IUserService, @Inject(IRecipeServiceProvider) private recipeService: IRecipeService,
              @Inject(ISocketServiceProvider) private socketService: ISocketService) {}

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

      this.socketService.emitRecipeCreateEvent(addedRecipe);
      return addedRecipe;
    }
    catch (e)
    {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('getRecipes')
  async getRecipes(@Query() filter: Filter){
    try{return await this.recipeService.getRecipes(filter);}
    catch (e) {console.log(e.message);throw new HttpException(e.message, HttpStatus.BAD_REQUEST);}
  }

  @UseGuards(JwtAuthGuard)
  @Get('getPersonalRecipes')
  async getPersonalRecipes(@Query() filter: Filter){
    return this.recipeService.getRecipes(filter);
  }

  @UseGuards(JwtAuthGuard)
  @Post('getPersonalById')
  async getPersonalByID(@MessageBody() recipeGetDTO: RecipeGetDto){
    try
    {
      return await this.recipeService.getRecipeById(recipeGetDTO.recipeID, recipeGetDTO.userID, recipeGetDTO.userIDRating);
    }
    catch (e) {throw new HttpException('Error loading recipe with ID: ' + recipeGetDTO.recipeID, HttpStatus.NOT_FOUND);}
  }

  @Post('getById')
  async getByID(@MessageBody() recipeGetDTO: RecipeGetDto){
    try
    {
      return await this.recipeService.getRecipeById(recipeGetDTO.recipeID, recipeGetDTO.userID, recipeGetDTO.userIDRating);
    }
    catch (e) {console.log(e.message);throw new HttpException('Error loading recipe with ID: ' + recipeGetDTO.recipeID, HttpStatus.NOT_FOUND);}
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateRecipe(@MessageBody() recipe: Recipe){
    try
    {
      const updatedRecipe = await this.recipeService.updateRecipe(recipe);
      this.socketService.emitRecipeUpdateEvent(updatedRecipe);
      return updatedRecipe;
    }
    catch (e)
    {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('deleteRecipe')
  async deleteRecipe(@MessageBody() recipeDeleteDTO: RecipeDeleteDto){
    try
    {
      const deleted = await this.recipeService.deleteRecipe(recipeDeleteDTO.recipe.ID, recipeDeleteDTO.userID);
      if(!deleted){throw new Error('Error deleting recipe with ID ' + recipeDeleteDTO.recipe.ID)}
      this.socketService.emitRecipeDeleteEvent(recipeDeleteDTO.recipe);
      return deleted;
    }
    catch (e)
    {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('recipeCategories')
  async getRecipeCategories(){
    return await this.recipeService.getRecipeCategories();
  }

  @UseGuards(JwtAuthGuard)
  @Post('giveRating')
  async giveRating(@MessageBody() rating: Rating){
    try
    {
      const recipe: Recipe = await this.recipeService.createRating(rating);
      this.socketService.emitRecipeRatingUpdateEvent(recipe, rating);
      return recipe;
    }
    catch (e)
    {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('favorite')
  async favoriteRecipe(@MessageBody() favoriteDTO: FavoriteDto){
    try
    {
      await this.recipeService.favoriteRecipe(favoriteDTO);
      this.socketService.emitRecipeFavoriteUpdateEvent(favoriteDTO);
      return favoriteDTO;
    }
    catch (e)
    {
      throw new HttpException('Error saving favorite', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('unfavorite')
  async unfavoriteRecipe(@MessageBody() favoriteDTO: FavoriteDto){
    try
    {
      const deleted = await this.recipeService.unfavoriteRecipe(favoriteDTO);
      if(deleted){
        this.socketService.emitRecipeFavoriteUpdateEvent(favoriteDTO);
      }
      else{
        throw new Error('Error removing favorite');
      }
      return favoriteDTO;
    }
    catch (e)
    {
      throw new HttpException('Error removing favorite', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
