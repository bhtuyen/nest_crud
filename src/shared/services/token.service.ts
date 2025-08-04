import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { envConfig } from '@shared/config';
import { JwtPayload } from '@shared/types/jwt.type';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Sign access token
   * @param payload - Payload to sign
   * @returns Access token
   */
  signAccessToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload, {
      expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN,
      algorithm: 'HS256',
      secret: envConfig.ACCESS_TOKEN_SECRET
    });
  }

  /**
   * Sign refresh token
   * @param payload - Payload to sign
   * @returns Refresh token
   */
  signRefreshToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN,
      algorithm: 'HS256'
    });
  }

  /**
   * Verify access token
   * @param token - Token to verify
   * @returns Decoded token
   */
  verifyAccessToken(token: string) {
    return this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
      algorithms: ['HS256']
    });
  }

  /**
   * Verify refresh token
   * @param token - Token to verify
   * @returns Decoded token
   */
  verifyRefreshToken(token: string) {
    return this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
      algorithms: ['HS256']
    });
  }

  /**
   *
   * @param token
   * @returns
   */
  decodeToken(token: string) {
    return this.jwtService.decode<JwtPayload>(token);
  }
}
