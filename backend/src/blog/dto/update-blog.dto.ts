import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
    @IsString()
    @IsNotEmpty()
    slug:string
    @IsString()
    @IsOptional()
    title?: string;
    @IsOptional()
    @IsString()
    content?:string
    @IsOptional()
    @IsBoolean()
    IsPublished?: boolean ;
}
