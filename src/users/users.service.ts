import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose, { Model } from "mongoose";
import { ROLE_USER, User } from "./schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import { IUser } from "./user.interface";
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private usersModel: Model<User>,
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
      throw new BadRequestException("Email already exists");
    }
    createUserDto.password = this.hashPassword(createUserDto.password);
    return await this.usersModel.create({...createUserDto, role: ROLE_USER});
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    if( !mongoose.Types.ObjectId.isValid(id) ) {
      throw new BadRequestException("Invalid id of the user");
    }
    return await this.usersModel.findOne({ _id: id });
  }

  async update(id: string, updateUserDto: UpdateUserDto, user :IUser) {
    if( !mongoose.Types.ObjectId.isValid(id) ) {
      throw new BadRequestException("Invalid id of the user");
    }
    if(await this.isExistUser(updateUserDto.email)){
      throw new BadRequestException("Email already exists");
    }
    await this.usersModel.updateOne({_id: id}, {updatedBy: user._id});
    return await this.usersModel.updateOne({_id: id}, { ...updateUserDto});
  }

  async remove(id: number) {
    if(!mongoose.Types.ObjectId.isValid(id) ) {
      throw new BadRequestException("Invalid id of the user");
    }
    // soft delete
  }

  async findOneByUsername(username: string){
    return await this.usersModel.findOne({email: username});
  }

  async isExistUser(email: string){
    const isExist = await this.usersModel.findOne({email: email});
    return isExist ? true : false;
  }
}
