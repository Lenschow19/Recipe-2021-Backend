import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IRecipeServiceProvider } from '../core/primary-ports/recipe.service.interface';
import { RecipeService } from '../core/services/recipe.service';
import { RecipeController } from './controllers/recipe.controller';
import { RecipeGateway } from './gateways/recipe.gateway';
import { RecipeEntity } from '../infrastructure/data-source/postgres/entities/recipe.entity';
import { UserModule } from './user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([RecipeEntity])],
  providers: [{provide: IRecipeServiceProvider, useClass: RecipeService}, RecipeGateway],
  controllers: [RecipeController],
  exports: [IRecipeServiceProvider]
})
export class RecipeModule {}
