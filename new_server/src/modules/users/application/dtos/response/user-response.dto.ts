import { ApiProperty } from '@nestjs/swagger';
import { Favorite, SearchHistoryItem, UserPreferences } from '@src/modules/users/domain';

export class UserResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  isEmailVerified: boolean;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  profilePicture?: string;

  @ApiProperty()
  loginAttempts: number;

  @ApiProperty({ required: false })
  lockUntil?: Date;

  @ApiProperty({ required: false })
  lastLogin?: Date;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ type: [Object] })
  favorites: Favorite[];

  @ApiProperty({ type: Object })
  preferences: UserPreferences;

  @ApiProperty({ type: [Object] })
  searchHistory: SearchHistoryItem[];

  @ApiProperty()
  emailVerified: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
