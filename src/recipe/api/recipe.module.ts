import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IRecipeServiceProvider } from '../core/primary-ports/recipe.service.interface';
import { RecipeService } from '../core/services/recipe.service';
import { RecipeController } from './controllers/recipe.controller';
import { RecipeGateway } from './gateways/recipe.gateway';
import { TestEntity } from '../infrastructure/data-source/postgres/entities/test.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestEntity])],
  providers: [{provide: IRecipeServiceProvider, useClass: RecipeService}, RecipeGateway],
  exports: [IRecipeServiceProvider],
  controllers: [RecipeController]
})
export class RecipeModule {}
