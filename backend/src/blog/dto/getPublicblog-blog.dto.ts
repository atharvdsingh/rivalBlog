import { IsNumber, IsPositive, Min } from "class-validator"

export class GetPublicBlogsDto{
    @IsNumber()
    @IsPositive()
    limit?:number=10
    @IsNumber()
    @Min(0)
    offset?:number=0
    
}