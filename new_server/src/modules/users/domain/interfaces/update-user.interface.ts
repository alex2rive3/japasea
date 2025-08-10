import { UpdateUserRequestDto } from '../../application/dtos/request/update-user.request.dto';
import { UserResponseDto } from '../../application/dtos/response/user-response.dto';

export interface IUpdateUserUseCase {
  execute(id: string, updateUserDto: UpdateUserRequestDto): Promise<UserResponseDto>;
}
