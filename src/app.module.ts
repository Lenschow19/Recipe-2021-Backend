import { Module } from '@nestjs/common';
import * as Joi from '@hapi/joi';
import { ConfigModule } from '@nestjs/config';
import { RecipeModule } from './recipe/api/recipe.module';
import { DatabaseModule } from './recipe/infrastructure/data-source/postgres/database.module';
import { UserModule } from './recipe/api/user.module';
import { AuthModule } from './auth/auth.module';
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
