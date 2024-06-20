import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Transform } from "class-transformer";

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

  @Transform(({ value }) => new Date(value))
  @IsDate({message: "Không đúng định dạng ngày sinh"})
  @IsNotEmpty({message: "Không được để trống Age "})
  dob: Date;

  @IsString()
  @IsNotEmpty({message: "Không được để trống Gender "})
  gender: string;
}
