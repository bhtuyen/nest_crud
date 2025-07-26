import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@shared/services/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async remove(ID: string) {
    return await this.prisma.post.delete({
      where: { ID }
    });
  }

  async update(ID: string, data: Prisma.PostUpdateInput) {
    return await this.prisma.post.update({
      data,
      where: { ID }
    });
  }

  async create(data: Prisma.PostCreateInput) {
    return await this.prisma.post.create({
      data
    });
  }

  async findOne(ID: string) {
    return await this.prisma.post.findFirst({
      where: { ID }
    });
  }

  async findAll(filter?: Prisma.PostWhereInput) {
    return await this.prisma.post.findMany({
      where: filter
    });
  }
}
