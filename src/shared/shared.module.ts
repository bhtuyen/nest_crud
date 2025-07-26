import { Global, Module } from '@nestjs/common';
import { PrismaService } from '@shared/services/prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class SharedModule {}
