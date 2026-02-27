import {
  IsBoolean,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  content: string;
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsBoolean()
  IsPublished: boolean;

  @IsString()
  @IsOptional()
  summary: string;
}
