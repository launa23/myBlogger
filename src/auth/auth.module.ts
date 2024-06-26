import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from "../users/users.service";
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./passport/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import ms from 'ms';
import { JwtStrategy } from "./passport/jwt.strategy";
import { AuthController } from "./auth.controller";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./guard/roles.guard";
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secretOrPrivateKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRE'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService,
    LocalStrategy,
    JwtStrategy,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
