import { Body, Controller, Post, SerializeOptions } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDTO, RegisterBodyDTO, RegisterResponseDTO } from './dtos/auto.dto';
import { RefreshTokenBodyDTO } from '@shared/types/jwt.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Đăng ký tài khoản
   * @param body - Thông tin đăng ký
   * @returns Thông tin tài khoản
   */
  // @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    type: RegisterResponseDTO
  })
  @Post('register')
  register(@Body() body: RegisterBodyDTO) {
    return this.authService.register(body);
  }

  /**
   * Đăng nhập
   * @param body - Thông tin đăng nhập
   * @returns Thông tin tài khoản
   */
  @Post('login')
  login(@Body() body: LoginBodyDTO) {
    return this.authService.login(body);
  }

  /**
   * Refresh token
   * @param body - Thông tin refresh token
   * @returns Thông tin tài khoản
   */
  @Post('refresh-token')
  refreshToken(@Body() body: RefreshTokenBodyDTO) {
    return this.authService.refreshToken(body);
  }
}
