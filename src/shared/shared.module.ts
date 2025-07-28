import { Global, Module } from '@nestjs/common';
import { PrismaService } from '@shared/services/prisma.service';
import { HashingService } from './services/hashing.service';

/**
 * Dịch vụ chia sẻ
 * Dịch vụ này sẽ được sử dụng trong toàn bộ ứng dụng
 */
const services = [PrismaService, HashingService];

@Global()
@Module({
  providers: services,
  exports: services
})
export class SharedModule {}
