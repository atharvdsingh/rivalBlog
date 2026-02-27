import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { loginUserDto } from 'src/user/dto/login-user.dto';
import bcrypt, { genSalt } from "bcrypt"
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService,
    private readonly jwtSevice: JwtService
  ) { }
  async create(createAuthDto: CreateAuthDto) {

    createAuthDto.password = await bcrypt.hash(createAuthDto.password, 8)

    return await this.userService.create(createAuthDto)

  }

  async login(loginUserDto: loginUserDto) {
    const user = await this.userService.findOne(loginUserDto)
    if (!user) {
      throw new NotFoundException()
    }
    if (!bcrypt.compareSync(loginUserDto.password, user.password)) {
      throw new UnauthorizedException()
    }
    const payload = { id: user.id, email: user.email }
    const access_token = await this.jwtSevice.signAsync(payload)
    return { access_token }


  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
