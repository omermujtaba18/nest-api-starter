import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './resources/health/health.module';
import configuration from './confg/configuration';
import { LoggerModule } from '@app/logger';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    LoggerModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
