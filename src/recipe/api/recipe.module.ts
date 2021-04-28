import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IRecipeServiceProvider } from '../core/primary-ports/recipe.service.interface';
import { RecipeService } from '../core/services/recipe.service';
import { RecipeController } from './controllers/recipe.controller';
import { RecipeGateway } from './gateways/recipe.gateway';
import { RecipeEntity } from '../infrastructure/data-source/postgres/entities/recipe.entity';
import { UserModule } from './user.module';
import { IngredientEntryEntity } from '../infrastructure/data-source/postgres/entities/ingredient-entry.entity';
import { CategoryEntity } from '../infrastructure/data-source/postgres/entities/category.entity';
import { AppModule } from '../../app.module';
import { SocketModule } from './socket.module';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity, IngredientEntryEntity, CategoryEntity]), UserModule, SocketModule, ],
  providers: [{provide: IRecipeServiceProvider, useClass: RecipeService}],
  controllers: [RecipeController],
  exports: [IRecipeServiceProvider]
})
export class RecipeModule {}
