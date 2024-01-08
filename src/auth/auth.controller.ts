import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { UserSanitizer } from './interceptors/user-sanitizer.interceptor';

@Controller({
  path: "auth",
  version: "1",
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("signup")
  async signup(@Body() signUpDto: SignUpDto): Promise<{}> {
    await this.authService.emailExists(signUpDto.email);
    const data = await this.authService.signUp(signUpDto);
    const { _id: id, ...rest } = data["user"].toObject();
    const _id = id.toString();
    return {
      status: "success",
      user: new UserSanitizer({ _id, ...rest }),
      token: data["token"],
    };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("login")
  async login(@Body() loginDto: LoginDto): Promise<object> {
    const data = await this.authService.login(loginDto);
    const { _id:id, ...rest } = data['user'].toObject();
    const _id = id.toString();
    return {
      status: "success",
      user: new UserSanitizer({ _id, ...rest }),
      token: data["token"],
    };
  }
}
