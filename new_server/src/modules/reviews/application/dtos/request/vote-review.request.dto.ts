import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VoteReviewRequestDto {
  @IsString()
  @IsEnum(['yes', 'no'])
  @ApiProperty({ description: 'Vote for review helpfulness', enum: ['yes', 'no'] })
  vote: 'yes' | 'no';
}
