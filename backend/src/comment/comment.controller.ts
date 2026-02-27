import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('blogs')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post(':id/comments')
  @UseGuards(AuthGuard)
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req,
    @Param('id') id: string,
  ) {
    const userId = req.user.id;
    return this.commentService.create(createCommentDto, userId, id);
  }

  @Get(':id/comments')
  getByBlogId(@Param('id') id: string) {
    return this.commentService.getByBlogId(id);
  }
}
