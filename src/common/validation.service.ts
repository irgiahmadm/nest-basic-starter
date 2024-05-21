import { Injectable } from '@nestjs/common';
import { ZodType } from 'zod';

//schema validation using zod
@Injectable()
export class ValidationService {
  validate<T>(zodType: ZodType<T>, data: T): T {
    return zodType.parse(data);
  }
}
