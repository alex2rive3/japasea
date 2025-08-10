import { SoftDeleteUserRequestDto } from '../../application/dtos/request/soft-delete-user.request.dto';
import { UserResponseDto } from '../../application/dtos/response/user-response.dto';

export interface ISoftDeleteUserUseCase {
  execute(softDeleteDto: SoftDeleteUserRequestDto): Promise<UserResponseDto>;
}
