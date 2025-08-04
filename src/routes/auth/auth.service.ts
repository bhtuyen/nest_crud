import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { HashingService } from '@shared/services/hashing.service';
import { PrismaService } from '@shared/services/prisma.service';
import { LoginBodyDTO, RegisterBodyDTO } from './dtos/auto.dto';
import { TokenService } from '@shared/services/token.service';
import { RefreshTokenBodyDTO } from '@shared/types/jwt.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService
  ) {}

  /**
   * Đăng ký tài khoản
   * @param body - Thông tin đăng ký
   * @returns Thông tin tài khoản
   */
  async register(body: RegisterBodyDTO) {
    try {
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

  /**
   * Đăng nhập
   * @param body - Thông tin đăng nhập
   * @returns Thông tin tài khoản
   */
  async login(body: LoginBodyDTO) {
    const user = await this.prisma.user.findUnique({
      where: {
        Email: body.Email
      }
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const isPasswordValid = await this.hashingService.compare(body.Password, user.Password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const accessToken = await this.tokenService.signAccessToken({ UserID: user.ID });
    const refreshToken = await this.tokenService.signRefreshToken({ UserID: user.ID });

    const decodeRefreshToken = this.tokenService.decodeToken(refreshToken);

    const refreshTokenExpiredAt = new Date((decodeRefreshToken.exp ?? 0) * 1000);

    await this.prisma.refreshToken.deleteMany({
      where: {
        UserID: user.ID
      }
    });

    await this.prisma.refreshToken.create({
      data: {
        UserID: user.ID,
        Token: refreshToken,
        ExpiredAt: refreshTokenExpiredAt
      }
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(body: RefreshTokenBodyDTO) {
    try {
      const { UserID, exp } = await this.tokenService.verifyRefreshToken(body.refreshToken);

      const token = await this.prisma.refreshToken.findFirstOrThrow({
        where: {
          UserID: UserID
        }
      });

      console.log(token.Token);
      console.log(body.refreshToken);

      if (!token || token.Token !== body.refreshToken) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }

      if (token.ExpiredAt < new Date() || (exp && exp < Date.now() / 1000)) {
        throw new UnauthorizedException('Refresh token đã hết hạn');
      }

      await this.prisma.refreshToken.deleteMany({
        where: {
          UserID: UserID
        }
      });

      const accessToken = await this.tokenService.signAccessToken({ UserID });
      const refToken = await this.tokenService.signRefreshToken({ UserID });

      await this.prisma.refreshToken.create({
        data: {
          UserID,
          Token: refToken,
          ExpiredAt: new Date((exp ?? 0) * 1000)
        }
      });

      return { accessToken, refreshToken: refToken };
    } catch (error) {
      console.log(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }

      throw new UnauthorizedException('Refresh token không hợp lệ');
    }
  }
}
