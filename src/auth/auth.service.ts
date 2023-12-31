import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { ApiFeatures } from 'src/utils/apiFeatures';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) { }
  
  // Email Exists or not
  async emailExists(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new BadRequestException('Email already used');
    }
  }
  
  // Register user
  async signUp(signUpDto: SignUpDto): Promise<object>{
    const { name, email, password } = signUpDto;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({ name, email, password: hashPassword });
    const token = await ApiFeatures.assignTokenToAuthorization(user._id, this.jwtService);
    return { user, token };
  }

  // Login user
  async login(loginDto: LoginDto): Promise<object> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const token = await ApiFeatures.assignTokenToAuthorization(user._id, this.jwtService);
    return { user, token };
  }

}
