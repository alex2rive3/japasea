import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SoftDeletePlaceRequestDto {
  @IsMongoId()
  @ApiProperty({ description: 'MongoDB ObjectId of the place to soft delete' })
  id: string;
  reason: string;
}
