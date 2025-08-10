import { UserResponseDto } from '../../application/dtos/response/user-response.dto';

export interface IFindUserByIdUseCase {
  execute(id: string): Promise<UserResponseDto>;
}
