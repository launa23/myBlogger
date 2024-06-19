import { Injectable } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { IUser } from "../users/user.interface";
import { User } from "../utils/decorators/user.decorator";


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
    }
    return null;
  }

  async login(user: IUser) {
    const { email, role, _id, name } = user;
    // Du lieu muon ma hoa trong token
    const payload = {
      email: user.email,
      sub: user._id
    };
    return {
      // ham sign() la sinh ra token, chi voi 1 ham
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        name,
        email,
        role
      }
    };
  }
}
