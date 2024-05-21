import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { UserValidation } from 'src/user/user.validation';
import { LoginUserDto, UserResponse } from 'src/model/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginUserDto): Promise<UserResponse> {
    try {
      this.logger;

      const loginMember: LoginUserDto = this.validationService.validate(
        UserValidation.LOGIN,
        loginDto,
      );

      const user = await this.prismaService.user.findFirst({
        where: { email: loginMember.email },
      });

      if (!user) {
        throw new HttpException('User email or password is invalid', 401);
      }

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new HttpException('User email or password is invalid.', 401);
      }

      const userResponse: UserResponse = {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      };

      userResponse.accessToken = await this.jwtService.signAsync(userResponse);

      return userResponse;
    } catch (error) {
      throw error;
    }
  }
}
