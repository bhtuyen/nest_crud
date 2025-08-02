import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterBodyDTO } from './auto.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Đăng ký tài khoản
   * @param body - Thông tin đăng ký
   * @returns Thông tin tài khoản
   */
  @Post('register')
  register(@Body() body: RegisterBodyDTO) {
    console.log(body);
    return 'register';
    return this.authService.register(body);
  }
}
