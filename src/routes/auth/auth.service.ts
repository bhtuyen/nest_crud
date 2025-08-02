import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { HashingService } from '@shared/services/hashing.service';
import { PrismaService } from '@shared/services/prisma.service';
import { RegisterBodyDTO } from './auto.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prisma: PrismaService
  ) {}

  /**
   * Đăng ký tài khoản
   * @param body - Thông tin đăng ký
   * @returns Thông tin tài khoản
   */
  async register(body: RegisterBodyDTO) {
    try {
      console.log(body);
      const passwordHash = await this.hashingService.hash(body.Password);
      const user = await this.prisma.user.create({
        data: {
          Email: body.Email,
          Password: passwordHash,
          Name: body.Name
        }
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email đã tồn tại');
      }

      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }
}
