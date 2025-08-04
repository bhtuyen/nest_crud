import { Global, Module } from '@nestjs/common';
import { PrismaService } from '@shared/services/prisma.service';
import { HashingService } from './services/hashing.service';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';

/**
 * Dịch vụ chia sẻ
 * Dịch vụ này sẽ được sử dụng trong toàn bộ ứng dụng
 */
const services = [PrismaService, HashingService, TokenService];

@Global()
@Module({
  providers: services,
  exports: services,
  imports: [JwtModule]
})
export class SharedModule {}
