import { User } from '../../domain/entities/user.entity';
import { UserResponseDto } from '../dtos/response/user-response.dto';

export class UserMapper {
  static toResponseDto(user: User): UserResponseDto {
    return {
      _id: user._id?.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      phone: user.phone,
      profilePicture: user.profilePicture,
      loginAttempts: user.loginAttempts,
      lockUntil: user.lockUntil,
      lastLogin: user.lastLogin,
      isActive: user.isActive,
      favorites: user.favorites,
      preferences: user.preferences,
      searchHistory: user.searchHistory,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toResponseDtoArray(users: User[]): UserResponseDto[] {
    return users.map(user => this.toResponseDto(user));
  }
}
