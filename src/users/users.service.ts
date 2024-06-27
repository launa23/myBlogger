import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from "./entities/user.entity";
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import { IUser } from "./user.interface";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "../utils/app.constant";
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  hashPassword = async (password: string) => {
      const salt = genSaltSync(10);
      const hash = hashSync(password, salt);
      return hash;
  }

  // So sanh password bang ham compareSync() vi password trong db la hashpassword
  isValidPassword(pass: string, hashPass: string){
    return compareSync(pass, hashPass);
  }

  async create(createUserDto: CreateUserDto) {
    if(await this.isExistUser(createUserDto.email)){
      throw new BadRequestException("Email đã tồn tại");
    }
    createUserDto.password = await this.hashPassword(createUserDto.password);
    return await this.userRepository.save({...createUserDto, role: Role.USER});
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneById(+id);
    if( !user ) {
      throw new BadRequestException("User không tồn tại");
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, user :IUser) {
    if( !await this.userRepository.findOneById(+id)) {
      throw new BadRequestException("User không tồn tại");
    }
    if(await this.isExistUser(updateUserDto.email)){
      throw new BadRequestException("Email đã tồn tại");
    }
    return await this.userRepository.update(+id, { ...updateUserDto});
  }

  async updateAvatar(user :IUser, filename: string) {
    await this.findOne(user.id);
    await this.userRepository.update(user.id, { avatar: filename });
    return {
      user_id: user.id,
      avatar: filename
    }
  }


  async remove(id: number) {
    const isExistUser = await this.userRepository.findOneById(+id);
    if(!isExistUser) {
      throw new BadRequestException("User không tồn tại");
    }
    // soft delete
    return await this.userRepository.update(+id, {isDeleted: true, deletedAt: new Date()});
  }

  async findOneByUsername(username: string){
    return await this.userRepository.findOneBy({email: username});
  }

  async isExistUser(email: string){
    const isExist = await this.userRepository.findOneBy({email: email});
    return isExist ? true : false;
  }

  updateUserToken = async (refreshToken: string, id: number) => {
    return await this.userRepository.update({id: id}, {refreshToken})
  }

  async findUserByToken(token: string){
    const user = await this.userRepository.findOneBy({refreshToken: token});
    if( !user ) {
      throw new BadRequestException("Refresh token không hợp lệ");
    }
    return user;
  }

  async deleteRefreshToken(id: number){
    return await this.userRepository.update({id}, {refreshToken: null});
  }
}
