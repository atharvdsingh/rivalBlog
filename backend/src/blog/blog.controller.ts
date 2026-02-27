import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Request,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetPublicBlogsDto } from './dto/getPublicblog-blog.dto';

@Controller()
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @UseGuards(AuthGuard)
  @Post('blog')
  createBlog(@Body() createBlogDto: CreateBlogDto, @Req() req) {
    const userId = req.user.id;
    return this.blogService.createBlog(createBlogDto, userId);
  }

  @Get('public/blog/:slug')
  async findOne(@Param('slug') slug: string, @Req() req) {
    const userId = req.user?.id;
    return await this.blogService.findOne(slug, userId);
  }

  @Patch('blog/:id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }

  @UseGuards(AuthGuard)
  @Delete('blog/:id')
  async remove(@Param('id') id: string) {
    return await this.blogService.remove(id);
  }

  @Get('public/feed')
  async getPublicBlogs(@Query() getPublicBlogDto: GetPublicBlogsDto) {
    return await this.blogService.findAll(getPublicBlogDto);
  }

  @UseGuards(AuthGuard)
  @Get('dashboard/blogs')
  async getUserBlogs(@Req() req) {
    const userId = req.user.id;
    return await this.blogService.findUserBlogs(userId);
  }
}
