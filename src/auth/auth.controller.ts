import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { sanitizeData } from 'src/utils/sanitizeData';
import { LoginDto } from './dto/login.dto';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private authService:AuthService
  ) { }
  
  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto): Promise<{}>{
    await this.authService.emailExists(signUpDto.email);
    const data = await this.authService.signUp(signUpDto)
    return {
      status: "success",
      user: sanitizeData(data['user']),
      token: data['token'],
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<object>{
    const data = await this.authService.login(loginDto);
    return {
      status: "success",
      user: sanitizeData(data['user']),
      token: data['token'],
    };
  }

}
