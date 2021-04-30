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
import { FavoriteEntity } from '../infrastructure/data-source/postgres/entities/favorite.entity';
import { IRatingServiceProvider } from '../core/primary-ports/rating.service.interface';
import { RatingService } from '../core/services/rating.service';
import { RatingController } from './controllers/rating.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity, IngredientEntryEntity, CategoryEntity, RatingEntity, FavoriteEntity]), UserModule, SocketModule],
  providers: [{provide: IRecipeServiceProvider, useClass: RecipeService}, {provide: IRatingServiceProvider, useClass: RatingService}],
  controllers: [RecipeController, RatingController],
  exports: [IRecipeServiceProvider, IRatingServiceProvider]
})
export class RecipeModule {}
