import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SoftDeleteUserRequestDto {
  @IsMongoId()
  @ApiProperty({ description: 'MongoDB ObjectId of the user to soft delete' })
  id: string;
}
