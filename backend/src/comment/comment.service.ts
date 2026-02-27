import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prismaService:PrismaService){}
 async create(createCommentDto: CreateCommentDto,
  id:string,
  userId:string
 ) {
     const [ likesCount ] =  await this.prismaService.$transaction([
      this.prismaService.comment.create({
        data:{
          userId:userId,
          content:createCommentDto.content,
          blogId:id
        }
      }),
      this.prismaService.comment.count({
        where:{
          blogId:id
        }
      })
     ])
     return likesCount
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
