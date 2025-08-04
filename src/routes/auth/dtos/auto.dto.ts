import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { UserEntity } from '../entities/user.entity';
import { Exclude } from 'class-transformer';
import { User } from '@prisma/client';
import { Match } from '@shared/decorators/match';

export class LoginBodyDTO implements Pick<UserEntity, 'Email' | 'Password'> {
  @IsString()
  @IsEmail()
  Email: string;
  @IsString()
  @IsStrongPassword()
  Password: string;
}

export class RegisterBodyDTO extends LoginBodyDTO implements Pick<UserEntity, 'Email' | 'Password' | 'Name'> {
  @IsString()
  Name: string;

  @Match('Password', {
    message: 'Password and ConfirmPassword must match'
  })
  @IsString()
  @IsStrongPassword()
  ConfirmPassword: string;
}

export class RegisterResponseDTO implements User {
  ID: string;
  Email: string;
  Name: string;
  @Exclude()
  Password: string;
  @Exclude()
  CreatedAt: Date;
  @Exclude()
  UpdatedAt: Date;

  constructor(partial: Partial<RegisterResponseDTO>) {
    Object.assign(this, partial);
  }
}
