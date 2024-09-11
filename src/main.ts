import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@app/logger';
import { UnhandledErrorFilter } from './common/filters/unhandled-error/unhandled-error.filter';
import IConfiguration from './confg/config.interface';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const configService = app.get(ConfigService<IConfiguration>);

  const env = configService.get('env');
  const apiDocsEndpoint = 'api-docs';

  if (env !== 'production') {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Weyrk API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(apiDocsEndpoint, app, document, {
      customSiteTitle: 'Weyrk API',
    });
  }

  const port = configService.get('port');

  const logger = app.get(Logger);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new UnhandledErrorFilter(logger));

  await app.listen(port);
}
bootstrap();
