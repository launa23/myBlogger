import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose, { Model } from "mongoose";
import { User } from "./schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
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
    createUserDto.password = this.hashPassword(createUserDto.password);
    return await this.usersModel.create(createUserDto);
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.usersModel.updateOne({_id: id}, updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOneByUsername(username: string){
    return await this.usersModel.findOne({email: username});
  }
}
