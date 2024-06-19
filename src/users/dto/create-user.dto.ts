import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({message: "Không được để trống Name "})
  name: string;

  @IsEmail({}, {message: "Không đúng định dạng email"})
  @IsNotEmpty({message: "Không được để trống Email "})
  email: string;

  @IsString()
  @IsNotEmpty({message: "Không được để trống Password "})
  password: string;

  @IsNumber()
  @IsNotEmpty({message: "Không được để trống Age "})
  age: number;

  @IsString()
  @IsNotEmpty({message: "Không được để trống Gender "})
  gender: string;
}
