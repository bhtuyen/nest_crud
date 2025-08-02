import { Body, Controller, Post, SerializeOptions } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterBodyDTO, RegisterResponseDTO } from './dtos/auto.dto';

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
  async register(@Body() body: RegisterBodyDTO) {
    const result = await this.authService.register(body);
    return result;
  }
}
