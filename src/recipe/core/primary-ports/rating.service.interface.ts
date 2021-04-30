import { Recipe } from '../models/recipe';
import { RatingDto } from '../../api/dtos/rating.dto';

export const IRatingServiceProvider = 'IRatingServiceProvider'
export interface IRatingService{
  createRating(rating: RatingDto): Promise<boolean>
  deleteRating(rating: RatingDto): Promise<boolean>
}
