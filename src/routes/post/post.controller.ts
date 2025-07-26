import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PostService } from '@routes/post/post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Post()
  create(@Body() data: Prisma.PostCreateInput) {
    return this.postService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.PostUpdateInput) {
    return this.postService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
