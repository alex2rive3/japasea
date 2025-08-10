import { CreateUserRequestDto } from '../../application/dtos/request/create-user.request.dto';
import { UserResponseDto } from '../../application/dtos/response/user-response.dto';

export interface ICreateUserUseCase {
  execute(createUserDto: CreateUserRequestDto): Promise<UserResponseDto>;
}
