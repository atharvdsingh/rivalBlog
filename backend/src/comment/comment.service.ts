import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createCommentDto: CreateCommentDto, userId: string, blogId: string) {
    const comment = await this.prismaService.comment.create({
      data: {
        userId: userId,
        content: createCommentDto.content,
        blogId: blogId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return comment;
  }

  async getByBlogId(blogId: string) {
    return await this.prismaService.comment.findMany({
      where: { blogId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }
}
