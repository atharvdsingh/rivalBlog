import { Controller, Post, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('blogs')
export class LikeController {
  constructor(private readonly likeService: LikeService) { }

  @Post(':id/like')
  @UseGuards(AuthGuard)
  create(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.likeService.create(id, userId);
  }

  @Delete(':id/like')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.likeService.remove(id, userId);
  }
}
