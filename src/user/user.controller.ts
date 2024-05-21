import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserResponse } from 'src/model/user.model';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/public.decorator';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('User')
@Controller('v1/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Create User' })
  async register(@Body() userDto: CreateUserDto): Promise<UserResponse> {
    return await this.userService.register(userDto);
  }

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create User' })
  async create(@Body() userDto: CreateUserDto): Promise<UserResponse> {
    return await this.userService.register(userDto);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get()
  async fetchAll(): Promise<UserResponse[]> {
    return await this.userService.fetchAll();
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserResponse | null> {
    return await this.userService.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ): Promise<UserResponse | null> {
    return await this.userService.update(id, updateUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    return await this.userService.remove(id);
  }
}
