import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('blogs')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(":id/like")
  @UseGuards(AuthGuard)
  @UseGuards(AuthGuard)
  create(@Param("id") id:string,
  @Req() req
) {
  const userId= req.user.id
    
    return this.likeService.create(id,userId);

  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLikeDto: UpdateLikeDto) {
    return this.likeService.update(+id, updateLikeDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id/like')
  remove(@Param('id') id: string,
  @Res() req
) {
  const userId=req.user.id
  console.log(userId)
    return this.likeService.remove(id,userId);
  }
}
