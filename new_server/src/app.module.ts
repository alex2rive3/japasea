import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { mongoConfig, HttpLoggerMiddleware, AppLogger } from './infrastructure';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PlacesModule } from './modules/places/places.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { AdminModule } from './modules/admin/admin.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { ChatModule } from './modules/chat/chat.module';
import { HealthModule } from './modules/health/health.module';
import { SharedModule } from './shared/shared.module';
import { JwtAuthGuard, RolesGuard } from './shared';

const coreModules = [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
];

const infrastructureModules = [
  MongooseModule.forRoot(mongoConfig.uri, mongoConfig.options),
  ThrottlerModule.forRoot([{
    ttl: 60000,
    limit: 100,
  }]),
  SharedModule,
];

const featureModules = [
  UsersModule,
  AuthModule,
  PlacesModule,
  ReviewsModule,
  AdminModule,
  FavoritesModule,
  ChatModule,
  HealthModule,
];

@Module({
  imports: [
    ...coreModules,
    ...infrastructureModules,
    ...featureModules,
  ],
  controllers: [],
  providers: [
    AppLogger,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(HttpLoggerMiddleware)
      .exclude('/api/health')
      .forRoutes('*');
  }
}
