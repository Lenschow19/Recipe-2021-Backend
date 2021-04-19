import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IRecipeServiceProvider } from '../core/primary-ports/recipe.service.interface';
import { RecipeService } from '../core/services/recipe.service';
import { RecipeController } from './controllers/recipe.controller';
import { RecipeGateway } from './gateways/recipe.gateway';
import { UserEntity } from '../infrastructure/data-source/postgres/entities/user.entity';
import { AuthenticationHelper } from '../infrastructure/security/authentication.helper';
import { IUserServiceProvider } from '../core/primary-ports/user.service.interface';
import { UserService } from '../core/services/user.service';
import { UserModule } from './user.module';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [UserModule],
  providers: [{provide: IRecipeServiceProvider, useClass: RecipeService}, RecipeGateway, AuthenticationHelper],
  exports: [IRecipeServiceProvider, AuthenticationHelper],
  controllers: [RecipeController]
})
export class RecipeModule {}
