import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());        // Khai bao de su dung Pipe de validate duw lieu thong qua cac decorator
  await app.listen(configService.get<string>("PORT"));
}
bootstrap();
