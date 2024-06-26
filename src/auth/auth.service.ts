import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { IUser } from "../users/user.interface";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { ConfigService } from "@nestjs/config";
import ms from "ms";
import { Response } from "express";


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {
  }

  //
  async validateUser(username: string, pass: string): Promise<any> {
    // findOneUsername() de tim user co email == username trong db
    const user = await this.usersService.findOneByUsername(username);
    if (user){
      const isValid = this.usersService.isValidPassword(pass, user.password)
      if(isValid === true){
        return user;
      }
      else{
        throw new BadRequestException("Thông tin đăng nhập không hợp lệ!");
      }
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const { email, role, id, name } = user;
    // Du lieu muon ma hoa trong token
    const payload = {
      email: email,
      id: id,
      name: name,
      role: role
    };
    const refreshToken = this.createRefreshToken(payload);
    await this.usersService.updateUserToken(refreshToken, id);
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE'))
    });
    return {
      // ham sign() la sinh ra token, chi voi 1 ham
      access_token: this.jwtService.sign(payload),
      user: {
        id,
        name,
        email,
        role
      }
    };
  }

  async register(createUser: CreateUserDto) {
    const user = await this.usersService.create(createUser);
    return {
      id: user.id,
      name: user.name,
      createdAt: user.createdAt,
    };
  }

  createRefreshToken = (payload) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')
    });
    return refreshToken;
  }

  processNewToken = async (refreshToken: string, response: Response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET')
      })
      let user = await this.usersService.findUserByToken(refreshToken);
      if (user){
        // Có user thì dùng lại hàm login đế sinh ra 1 access token mới
        const { email, role, id, name } = user;
        const payload = {
          sub: "token refresh" ,
          iss: "from server",
          id,
          name,
          email,
          role
        };
        const refresh_token = this.createRefreshToken(payload)
        // Vì user ở đây là 1 model nên _id là 1 ObjectId nên ko đúng kiểu ta phải chuyển về string
        await this.usersService.updateUserToken(refresh_token, id);
        response.clearCookie("refresh_token1");
        response.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE'))
        });
        return {
          access_token: this.jwtService.sign(payload),
          user: {
            id,
            name,
            email,
            role
          }
        };
      }
      else{
        throw new BadRequestException("Refresh token hết hạn vui lòng login");
      }
    }
    catch (e){
      throw new BadRequestException("Refresh token hết hạn vui lòng login");
    }
  }

  logout = async (user: IUser, res: Response) => {
    // Lấy token trong request
    const refreshToken = res.clearCookie("refresh_token");
    await this.usersService.deleteRefreshToken(user.id);
    return 'OK';
  }
}
