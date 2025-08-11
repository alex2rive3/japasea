import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { mongoConfig } from './infrastructure';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    MongooseModule.forRoot(mongoConfig.uri, mongoConfig.options),
    
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    
    UsersModule,
    AuthModule,
    PlacesModule,
    ReviewsModule,
    AdminModule,
    FavoritesModule,
    ChatModule,
    HealthModule,
    SharedModule,
  ],
  controllers: [],
  providers: [
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
export class AppModule {}
