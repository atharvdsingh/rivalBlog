import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(blogId: string, userId: string) {
    try {
      const newLike = await this.prismaService.like.create({
        data: {
          userId: userId,
          blogId: blogId,
        },
      });

      const likesCount = await this.prismaService.like.count({
        where: { blogId },
      });

      return { ...newLike, likesCount };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('You have already liked this blog');
        }
      }
      throw new InternalServerErrorException('Failed to like blog');
    }
  }

  async remove(blogId: string, userId: string) {
    try {
      await this.prismaService.like.deleteMany({
        where: {
          blogId: blogId,
          userId: userId,
        },
      });

      const likesCount = await this.prismaService.like.count({
        where: { blogId },
      });

      return { likesCount };
    } catch (error) {
      throw new InternalServerErrorException('Failed to unlike blog');
    }
  }
}
