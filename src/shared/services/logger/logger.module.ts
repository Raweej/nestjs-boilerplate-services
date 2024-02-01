import { WinstonModule } from 'nest-winston';

import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CustomLoggerService } from '@shared/services/logger/logger.service';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        format: format.combine(
          format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          format.printf(
            ({
              level,
              message,
              timestamp,
              service,
              uuid,
              func_name,
              endpoint,
            }) => {
              return `[${timestamp}] [${service}] [${func_name}] [${endpoint}] [${uuid}] [${level}]: ${JSON.stringify(
                message,
              )} `;
            },
          ),
        ),
        defaultMeta: { service: process.env.SERVICE_NAME },
        transports: [
          new transports.DailyRotateFile(config.get('winstonTransportError')),
          new transports.DailyRotateFile(config.get('winstonTransportCombine')),
        ],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class CustomLoggerModule {}
