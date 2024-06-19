import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from './users/users.module';
import { AuthService } from "./auth/auth.service";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        // connectionFactory: (connection) => {
        //   connection.plugin(softDeletePlugin);
        //   return connection;
        // }
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
