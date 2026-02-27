import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';
import { GetPublicBlogsDto } from './dto/getPublicblog-blog.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prismaSerive: PrismaService) {}

  async createBlog(createBlogDto: CreateBlogDto, ownerId: string) {
    try {
      return await this.prismaSerive.blog.create({
        data: {
          title: createBlogDto.title,
          ownerId: ownerId,
          content: createBlogDto.content,
          slug: createBlogDto.title
            .toLocaleLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, ''),
          isPublished: createBlogDto.IsPublished!,
          summary: createBlogDto.summary!,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new ConflictException('blog with this slug already exists');
        }
      }
      throw new InternalServerErrorException(
        'Failed to create blog. Please try again later.',
      );
    }
  }

  async findAll(getPublicBlogDto: GetPublicBlogsDto) {
    try {
      const [data, total] = await Promise.all([
        this.prismaSerive.blog.findMany({
          where: { isPublished: true },
          skip: getPublicBlogDto.offset,
          take: getPublicBlogDto.limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            slug: true,
            content: true,
            summary: true,
            isPublished: true,
            createdAt: true,
            updateAt: true,
            ownerId: true,
            owner: {
              select: {
                id: true,
                email: true,
              },
            },
            _count: {
              select: {
                comments: true,
                likes: true,
              },
            },
          },
        }),
        this.prismaSerive.blog.count({
          where: { isPublished: true },
        }),
      ]);

      return {
        data,
        total,
        limit: getPublicBlogDto.limit,
        offset: getPublicBlogDto.offset,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch blogs. Please try again later.',
      );
    }
  }

  async findOne(slug: string, userId?: string) {
    const blog = await this.prismaSerive.blog.findFirst({
      where: { slug },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    if (!blog.isPublished && blog.ownerId !== userId) {
      throw new NotFoundException('blog not found');
    }

    const isLiked = userId
      ? blog.likes.some((like) => like.userId === userId)
      : false;

    return { ...blog, isLiked };
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    return await this.prismaSerive.blog.update({
      where: { id },
      data: {
        title: updateBlogDto.title,
        content: updateBlogDto.content,
        slug: updateBlogDto.title
          ?.toLocaleLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
        isPublished: updateBlogDto.IsPublished,
      },
    });
  }

  async remove(id: string) {
    try {
      return await this.prismaSerive.blog.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2025') {
          throw new NotFoundException('blog does not exist');
        }
      }
      throw new InternalServerErrorException(
        'Failed to delete blog. Please try again later.',
      );
    }
  }

  async findUserBlogs(userId: string) {
    return await this.prismaSerive.blog.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        summary: true,
        isPublished: true,
        createdAt: true,
        updateAt: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
  }
}
