import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { IRecipeService, IRecipeServiceProvider } from '../../core/primary-ports/recipe.service.interface';
import { MessageBody } from '@nestjs/websockets';

@Controller('recipe')
export class RecipeController {

}
