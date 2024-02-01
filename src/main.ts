import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestConfig, KafkaConfig, SwaggerConfig } from '@config/default.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prefixGlobal = 'fins-service';

  const configService = app.get(ConfigService);
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');
  const nestConfig = configService.get<NestConfig>('nest');
  const kafkaConfig = configService.get<KafkaConfig>('kafka');

  // set kafka microservice
  // const kafkaService = app.connectMicroservice({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       brokers: [
  //         kafkaConfig?.BROKER_KAFKA_1,
  //         kafkaConfig?.BROKER_KAFKA_2,
  //         kafkaConfig?.BROKER_KAFKA_3,
  //       ],
  //     },
  //     consumer: {
  //       groupId: 'kyc-consumer',
  //     },
  //   },
  // });

  //enable cors
  app.enableCors({ origin: '*' });
  //set global prefix
  app.setGlobalPrefix(prefixGlobal);
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      transform: true,
      whitelist: true,
    }),
  );
  //set versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  //check if in development mode then enable swagger
  if (nestConfig.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version)
      .addTag(swaggerConfig.tags[0])
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${prefixGlobal}/docs`, app, document);
  }

  await app.startAllMicroservices();
  await app.listen(nestConfig?.PORT || 3000, () => {
    console.log(`app listen port ${nestConfig?.PORT || 3000}`);
  });
}
bootstrap();
