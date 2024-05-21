import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserDto, UserResponse } from 'src/model/user.model';
import { AuthService } from './auth.service';
import { Public } from 'src/common/public.decorator';
import { RolesGuard } from './roles.guard';
import { Roles } from 'src/common/roles.decorator';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login User' })
  async login(@Body() userDto: LoginUserDto): Promise<UserResponse> {
    try {
      return await this.authService.login(userDto);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Get('profile')
  @UseGuards(RolesGuard)
  @UseGuards(RolesGuard)
  @Roles('user')
  getProfile(@Request() req) {
    try {
      return req.user;
    } catch (error) {
      throw error;
    }
  }
}
