import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/entities/user.entity';
import { UserController } from './controllers/user.controller';
import { providers } from './domain/providers/user.provider';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserController],
  providers: [...providers],
  exports: [...providers]
})
export class UsersModule {}
