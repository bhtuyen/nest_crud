import { User } from '@prisma/client';

export class UserEntity implements User {
  ID: string;
  Email: string;
  Name: string;
  Password: string;
  CreatedAt: Date;
  UpdatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
