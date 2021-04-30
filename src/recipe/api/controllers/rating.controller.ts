import { Controller, Delete, HttpException, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { MessageBody } from '@nestjs/websockets';
import { RatingDto } from '../dtos/rating.dto';
import { Recipe } from '../../core/models/recipe';
import { IRecipeService, IRecipeServiceProvider } from '../../core/primary-ports/recipe.service.interface';
import { ISocketService, ISocketServiceProvider } from '../../core/primary-ports/socket.service.interface';
import { IRatingService, IRatingServiceProvider } from '../../core/primary-ports/rating.service.interface';

@Controller('rating')
export class RatingController {

  constructor(@Inject(IRecipeServiceProvider) private recipeService: IRecipeService, @Inject(ISocketServiceProvider) private socketService: ISocketService,
              @Inject(IRatingServiceProvider) private ratingService: IRatingService) {}

  @UseGuards(JwtAuthGuard)
  @Post('giveRating')
  async giveRating(@MessageBody() rating: RatingDto){
    try
    {
      const created: boolean = await this.ratingService.createRating(rating);
      const recipe: Recipe = await this.recipeService.getRecipeById(rating.recipeID)
      this.socketService.emitRecipeRatingUpdateEvent(recipe, rating);
      return recipe;
    }
    catch (e)
    {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('deleteRating')
  async deleteRating(@MessageBody() rating: RatingDto){
    try
    {
      const deleted: boolean = await this.ratingService.deleteRating(rating);
      const recipe: Recipe = await this.recipeService.getRecipeById(rating.recipeID);
      rating.rating = 0;
      this.socketService.emitRecipeRatingUpdateEvent(recipe, rating);
      return recipe;
    }
    catch (e)
    {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
