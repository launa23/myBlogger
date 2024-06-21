import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { IUser } from "../users/user.interface";
import { User } from "../utils/decorators/user.decorator";
import { CreateUserDto } from "../users/dto/create-user.dto";


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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

  async login(user: IUser) {
    const { email, role, id, name } = user;
    // Du lieu muon ma hoa trong token
    const payload = {
      email: email,
      id: id,
      name: name,
      role: role
    };
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
}
