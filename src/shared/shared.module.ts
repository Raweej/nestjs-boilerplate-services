import { Global, Module } from '@nestjs/common';
import { CustomLoggerModule } from '@shared/services/logger/logger.module';

@Global()
@Module({
  imports: [CustomLoggerModule],
})
export class SharedModule {}
