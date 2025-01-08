import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { User } from '@/modules/users/schemas/user.schema';
import { UsersService } from '@/modules/users/users.service';
import { comparePasswordHelper } from '@/utils/helper';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { changePasswordAuthDto, CreateAuthDto, VerifyAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    
    if(!user) return null

    const isValidPassword = await comparePasswordHelper(pass, user.password);

    if(!isValidPassword) return null
    // TODO: Generate a JWT and return it here
    // instead of the user object
    return user
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      user: {
        email: user.email,
        _id: user._id,
        name: user.name
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async handleRegister(registerDto: CreateAuthDto){
    return this.usersService.handleRegister(registerDto)
  }

  async verify(verifyDto: VerifyAuthDto){
    return this.usersService.handleActive(verifyDto);
  }

  async retryActive(email: string){
    return this.usersService.retryActive(email);
  }

  async retryPassword(email: string){
    return this.usersService.retryPassword(email);
  }

  async changePassword(body: changePasswordAuthDto){
    return this.usersService.changePassword(body);
  }
}