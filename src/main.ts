import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options: CorsOptions = {origin: ['https://recipeappfrontend.web.app/home']}

  app.enableCors();
  const configService: ConfigService = app.get(ConfigService);
  await app.listen(configService.get('PORT') || 8080);
}
bootstrap();
