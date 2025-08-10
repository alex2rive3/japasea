import { UserResponseDto } from '../../application/dtos/response/user-response.dto';

export interface IFindAllUsersUseCase {
  execute(): Promise<UserResponseDto[]>;
}
