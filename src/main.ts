import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from './app.module';
import { ConfigService } from "@nestjs/config";
import { flatten, ValidationPipe, VersioningType } from "@nestjs/common";
import { JwtAuthGuard } from "./auth/guard/jwt-auth.guard";
import { TransformInterceptor } from "./core/transform.interceptor";
import { NestExpressApplication } from "@nestjs/platform-express";
import {join} from 'path';
import cookieParser from "cookie-parser";
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    },
    disableErrorMessages: false
  }));        // Khai bao de su dung Pipe de validate duw lieu thong qua cac decorator
  app.use(cookieParser());
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.useStaticAssets(join(__dirname, '..', 'public'));     // Cho phep o ben ngoai co the xem duoc tai nguyen trong thu muc public
// config CORS
  app.enableCors({
    "origin": true,    // Những nguồn có thể đi qua, * là tất cả
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    credentials: true
  });

  // Áp dụng version cho app
  app.setGlobalPrefix(configService.get<string>("API_PREFIX"));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2']
  });
  await app.listen(configService.get<string>("PORT"));
}
bootstrap();
