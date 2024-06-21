import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose, { Model } from "mongoose";
import { ROLE_USER, User } from "./entities/user.entity";
import { InjectModel } from "@nestjs/mongoose";
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import { IUser } from "./user.interface";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}


  // Hash password
  hashPassword = (password: string) => {
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
    createUserDto.password = this.hashPassword(createUserDto.password);
    return await this.userRepository.save({...createUserDto, role: ROLE_USER});
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    if( !await this.userRepository.findOneById(id) ) {
      throw new BadRequestException("User không tồn tại");
    }
    return await this.userRepository.findOneById(+id);
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
}
