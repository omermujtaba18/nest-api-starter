import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from './endpoints/health/health.module';
import configuration from './confg/configuration';
import { LoggerModule } from '@app/logger';
import { UsersService } from './endpoints/users/users.service';
import { UsersModule } from './endpoints/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './endpoints/auth/auth.module';
import { JwtAuthGuard } from './endpoints/auth/guards/jwt-auth.guard';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('database.uri'),
      }),
      inject: [ConfigService],
    }),
    LoggerModule,
    HealthModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    UsersService,
  ],
})
export class AppModule {}
