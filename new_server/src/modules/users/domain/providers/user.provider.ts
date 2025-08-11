import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { FindAllUsersUseCase } from '../../application/use-cases/find-all-users.use-case';
import { FindUserByIdUseCase } from '../../application/use-cases/find-user-by-id.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { SoftDeleteUserUseCase } from '../../application/use-cases/soft-delete-user.use-case';
import { MongoUserRepository } from '../../infrastructure/repositories/mongo-user.repository';
import { Provider } from '@nestjs/common';
import { UsersProvider } from './users.tokens';

export const providers: Provider[] = [
  {
    provide: UsersProvider.userRepository,
    useClass: MongoUserRepository,
  },
  {
    provide: UsersProvider.createUser,
    useClass: CreateUserUseCase
  },
  {
    provide: UsersProvider.findAllUsers,
    useClass: FindAllUsersUseCase
  },
  {
    provide: UsersProvider.findUserById,
    useClass: FindUserByIdUseCase
  },
  {
    provide: UsersProvider.updateUser,
    useClass: UpdateUserUseCase
  },
  {
    provide: UsersProvider.softDeleteUser,
    useClass: SoftDeleteUserUseCase
  }
];
