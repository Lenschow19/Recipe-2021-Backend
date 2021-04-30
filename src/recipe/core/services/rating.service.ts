import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RatingEntity } from '../../infrastructure/data-source/postgres/entities/rating.entity';
import { IRatingService } from '../primary-ports/rating.service.interface';
import { RatingDto } from '../../api/dtos/rating.dto';

@Injectable()
export class RatingService implements IRatingService{

  constructor(@InjectRepository(RatingEntity) private ratingRepository: Repository<RatingEntity>){}

  async createRating(rating: RatingDto): Promise<boolean> {
    const ratingEntity = this.ratingRepository.create(rating);
    ratingEntity.user = JSON.parse(JSON.stringify({ID: rating.userID}));
    ratingEntity.recipe = JSON.parse(JSON.stringify({ID: rating.recipeID}));
    await this.ratingRepository.save(ratingEntity);
    return true;
  }

  async deleteRating(rating: RatingDto): Promise<boolean> {

    const ratingDeleted = await this.ratingRepository.createQueryBuilder().delete()
      .where("recipeID = :recipeID AND userID = :userID", { recipeID: `${rating.recipeID}`, userID: `${rating.userID}`})
      .execute();

    if(ratingDeleted.affected){return true;}
    else{throw new Error('Could not find rating');}
    return false;
  }

}
