import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ResponseInterceptor } from './interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //set API
  app.setGlobalPrefix('api');

  //winston logger
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  //response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  //OpenAPI Swagger
  const config = new DocumentBuilder()
    .setTitle('Basic Nest')
    .setDescription('Starter for Nest JS with JWT')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('BasicNest')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);

  //get the base URL dynamically
  const server = await app.getUrl();
  const swaggerUrl = `${server}/docs`;

  //log the Swagger UI URL
  console.log(`Swagger UI is running at ${swaggerUrl}`);
}
bootstrap();
