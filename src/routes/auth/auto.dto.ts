import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class LoginBodyDTO {
  @IsString()
  @IsEmail()
  Email: string;
  @IsString()
  @IsStrongPassword()
  Password: string;
}

export class RegisterBodyDTO extends LoginBodyDTO {
  @IsString()
  Name: string;
  @IsString()
  @IsStrongPassword()
  ConfirmPassword: string;
}
