import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private readonly prismaService: PrismaService) { }
  async create(id: string, userId: string) {
    try {
      const [newLike, likesCount] = await this.prismaService.$transaction([
        this.prismaService.like.create({
          data: {
            userId: userId,
            blogId: id
          },
        }),
        this.prismaService.like.count({
          where: {
            blogId: id
          }
        })
      ]);

      return {
        ...newLike,
        likesCount
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException("failed to like")
      }
    }
  }

  findAll() {
    return `This action returns all like`;
  }

  findOne(id: number) {
    return `This action returns a #${id} like`;
  }

  update(id: number, updateLikeDto: UpdateLikeDto) {
    return `This action updates a #${id} like`;
  }

  async remove(id: string, userId: string) {
    const [likesCount] = await this.prismaService.$transaction([
       this.prismaService.like.create({
        data:{
          blogId:id,
          userId:userId
        }
      }),
      this.prismaService.like.count({
        where:{
          blogId:id
        }
      })      
    ])
    return likesCount
  }
}
