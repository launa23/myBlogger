import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from './users/users.module';
import { AuthService } from "./auth/auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostsModule } from './posts/posts.module';
import { CategoiesModule } from './categoies/categoies.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { PostcategoryModule } from './postcategory/postcategory.module';
import { TagsModule } from './tags/tags.module';
import { PosttagModule } from './posttag/posttag.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<string>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    CategoiesModule,
    CommentsModule,
    LikesModule,
    PostcategoryModule,
    TagsModule,
    PosttagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
