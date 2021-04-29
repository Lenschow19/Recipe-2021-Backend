import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IRecipeServiceProvider } from '../core/primary-ports/recipe.service.interface';
import { RecipeService } from '../core/services/recipe.service';
import { RecipeController } from './controllers/recipe.controller';
import { RecipeEntity } from '../infrastructure/data-source/postgres/entities/recipe.entity';
import { UserModule } from './user.module';
import { IngredientEntryEntity } from '../infrastructure/data-source/postgres/entities/ingredient-entry.entity';
import { CategoryEntity } from '../infrastructure/data-source/postgres/entities/category.entity';
import { SocketModule } from './socket.module';
import { RatingEntity } from '../infrastructure/data-source/postgres/entities/rating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity, IngredientEntryEntity, CategoryEntity, RatingEntity]), UserModule, SocketModule, ],
  providers: [{provide: IRecipeServiceProvider, useClass: RecipeService}],
  controllers: [RecipeController],
  exports: [IRecipeServiceProvider]
})
export class RecipeModule {}
