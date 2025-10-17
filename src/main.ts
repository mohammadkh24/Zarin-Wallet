import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './docs/swaggerDoc';
import {Request , Response} from 'express'
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get('app.port');

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    credentials: true, // اگر کوکی می‌خوای بفرستی
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    skipMissingProperties: true, 
  }));

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.getHttpAdapter().get('/swagger/json', (req: Request, res: Response) => {
    res.json(swaggerDocument );
  });

  await app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
    console.log(`Swagger UI available at http://localhost:${port}/docs`);
    console.log(
      `Swagger JSON available at http://localhost:${port}/swagger/json`,
    );
  });
}
bootstrap();
