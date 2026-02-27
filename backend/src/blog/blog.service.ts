import { ConflictException, Injectable, NotFoundException, Param, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { blog, Prisma } from 'generated/prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetPublicBlogsDto } from './dto/getPublicblog-blog.dto';
import { isIn, isInstance } from 'class-validator';

@Injectable()
export class BlogService {
  constructor(private readonly prismaSerive: PrismaService) { }
  async createBlog(createBlogDto: CreateBlogDto, ownerId) {

    try {
      return await this.prismaSerive.blog.create({
        data: {
          title: createBlogDto.title,
          ownerId: ownerId,
          content: createBlogDto.content,
          slug: createBlogDto.title.toLocaleLowerCase().replace(/[^a-z0-9-]+/g, '-'),
          isPublished: createBlogDto.IsPublished!,
          summary: createBlogDto.summary!

        }
      });
    } catch (error) {
      if(error instanceof Prisma.PrismaClientKnownRequestError){
        if(error.code=="P2002"){
          throw new ConflictException("blog with this slug already exists")
        }
      }
      throw new InternalServerErrorException('Failed to create blog. Please try again later.');
    }

  }

  async findAll(getPublicBlogDto: GetPublicBlogsDto) {
    try {
      return await this.prismaSerive.blog.findMany({
        where: {
          isPublished: true
        },
        skip: getPublicBlogDto.offset,
        take: getPublicBlogDto.limit,
        select: {
          content:true,
          title:true,
          comments: true,
          likes: true,
          owner: {
            select: {
              email: true
            }
          },
          _count:{
            select:{
              comments:true,
              likes:true
            }
          }
        }
      });
    } catch (error) {

      throw new InternalServerErrorException('Failed to fetch blogs. Please try again later.');
    }
  }

  async findOne(slug: string,
    userId: string

  ) {
    const blog = await this.prismaSerive.blog.findFirst({
      where: {
        slug: slug,
      },
      include: {
        owner: {
          select: {
            id: true
          }
        }
      }
    })
    if (!blog) {
      throw new NotFoundException("blog not found")
    }
    if (blog.isPublished) {
      return blog
    }
    if (blog.ownerId == userId) {
      return blog
    }
    throw new NotFoundException("blog not found")

  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    return await this.prismaSerive.blog.update({
      where: {
        id: id
      },
      data: {
        title: updateBlogDto.title!,
        content: updateBlogDto.content!,
        slug: updateBlogDto.title?.toLocaleLowerCase().replace(/[^a-z0-9-]+/g, '-'),
        isPublished: updateBlogDto.IsPublished
      }
    })
  }

  async remove(id: string) {
    try {
      return await this.prismaSerive.blog.delete({
        where: {
          id: id
        }
      });
    } catch (error) {
      if(error instanceof Prisma.PrismaClientKnownRequestError){
        if(error.code=="P2025"){
          throw new NotFoundException("blog does not exist")
        }
      }
      throw new InternalServerErrorException('Failed to delete blog. Please try again later.');

    }
  }
}
