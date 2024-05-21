import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { CreateUserDto, UserResponse } from 'src/model/user.model';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async register(userDto: CreateUserDto): Promise<UserResponse> {
    try {
      this.logger.info(`Register new user ${JSON.stringify(userDto)}`);

      const createUser: CreateUserDto = this.validationService.validate(
        UserValidation.REGISTER,
        userDto,
      );

      //check user if exist
      const existMember = await this.prismaService.user.count({
        where: { email: createUser.email },
      });

      if (existMember != 0) {
        throw new HttpException('User already exist', 400);
      }

      createUser.password = await bcrypt.hash(createUser.password, 10);

      console.log(createUser);
      const data = await this.prismaService.user.create({
        data: createUser,
      });

      const userResponse: UserResponse = {
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      };
      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<UserResponse | null> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!user) throw new NotFoundException();

      const userResponse: UserResponse = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      };

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<UserResponse | null> {
    try {
      const existingUser = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!existingUser) return null;

      const updatedUser = await this.prismaService.user.update({
        where: { id },
        data: updateUserDto,
      });

      const userResponse: UserResponse = {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
      };

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await this.prismaService.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async fetchAll(): Promise<UserResponse[]> {
    try {
      const data = await this.prismaService.user.findMany();
      const userResponses: UserResponse[] = data.map((user) => ({
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      }));

      return userResponses;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
