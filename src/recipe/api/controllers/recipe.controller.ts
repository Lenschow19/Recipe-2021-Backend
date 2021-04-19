import { Controller, Inject } from '@nestjs/common';
import { IRecipeService, IRecipeServiceProvider } from '../../core/primary-ports/recipe.service.interface';

@Controller('recipe')
export class RecipeController {

  constructor(@Inject(IRecipeServiceProvider) private recipeService: IRecipeService) {}

}
