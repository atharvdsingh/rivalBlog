import {  IsEmail, IsNotEmpty } from "class-validator"

export class loginUserDto{
    @IsEmail()
    @IsNotEmpty()
    email:string
    @IsNotEmpty()
    password:string
}