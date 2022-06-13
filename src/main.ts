import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const port = Number(process.env.PORT) || 4000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /**enable cors */
  app.enableCors();

  app.setGlobalPrefix('api');
  const options = new DocumentBuilder()
    .setTitle('Woozeee onthego project')
    .setDescription('Woozeee onthego project  api')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-doc', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  app.close();
  Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
