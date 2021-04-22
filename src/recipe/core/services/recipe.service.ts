import { Injectable } from '@nestjs/common';
import { IRecipeService } from '../primary-ports/recipe.service.interface';
import { Recipe } from '../models/recipe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeEntity } from '../../infrastructure/data-source/postgres/entities/recipe.entity';

@Injectable()
export class RecipeService implements IRecipeService{

  constructor(@InjectRepository(RecipeEntity) private recipeRepository: Repository<RecipeEntity>,) {}

  async createRecipe(recipe: Recipe): Promise<boolean> {

    if(recipe.title.length < 5 || recipe.title.length > 32){
      throw new Error('Recipe name must be between 5 and 32 characters');
    }

    if(recipe.description.length < 10 || recipe.description.length > 1000){
      throw new Error('Recipe description must be between 10 and 1000 characters');
    }

    if(recipe.imageURL === ''){
      //Insert some standard imageURL here
    }

    if(recipe.ingredientEntries.length < 1){
      throw new Error('Recipe requires ingredient(s)');
    }

    if(recipe.preparations.length > 1 || recipe.description.length > 1000){
      throw new Error('Recipe preparation description must be between 1 and 1000 characters');
    }


    const newRecipe = await this.recipeRepository.create(recipe);
    await this.recipeRepository.save(newRecipe);

    return true;
  }

}
