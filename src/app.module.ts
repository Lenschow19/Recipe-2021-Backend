import { Module } from '@nestjs/common';
import * as Joi from '@hapi/joi';
import { ConfigModule } from '@nestjs/config';
import { RecipeModule } from './recipe/api/recipe.module';
import { DatabaseModule } from './recipe/infrastructure/data-source/postgres/database.module';
import { UserModule } from './recipe/api/user.module';
import { AuthModule } from './auth/auth.module';
import { SocketService } from './recipe/core/services/socket.service';
import { ISocketServiceProvider } from './recipe/core/primary-ports/socket.service.interface';
import { WebSocketGateway } from '@nestjs/websockets';
import { RecipeGateway } from './recipe/api/gateways/recipe.gateway';
import { IRecipeServiceProvider } from './recipe/core/primary-ports/recipe.service.interface';
import { SocketModule } from './recipe/api/socket.module';

@Module({
  imports: [RecipeModule, UserModule, ConfigModule.forRoot({
    validationSchema: Joi.object({
      POSTGRES_HOST: Joi.string().required(),
      POSTGRES_PORT: Joi.number().required(),
      POSTGRES_USER: Joi.string().required(),
      POSTGRES_PASSWORD: Joi.string().required(),
      POSTGRES_DB: Joi.string().required(),
      PORT: Joi.number(),
    })
  }), DatabaseModule, AuthModule, SocketModule],
  controllers: [],
  providers: [],
  exports: []
})

export class AppModule {}
