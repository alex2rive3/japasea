import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case';
import { Provider } from '@nestjs/common';
import { AuthProvider } from './auth.tokens';

export const providers: Provider[] = [
  {
    provide: AuthProvider.login,
    useClass: LoginUseCase
  },
  {
    provide: AuthProvider.register,
    useClass: RegisterUseCase
  },
  {
    provide: AuthProvider.refreshToken,
    useClass: RefreshTokenUseCase
  },
  {
    provide: AuthProvider.logout,
    useClass: LogoutUseCase
  }
];
