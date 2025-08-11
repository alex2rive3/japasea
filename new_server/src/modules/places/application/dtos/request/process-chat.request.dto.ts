import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessChatRequestDto {
  @IsString()
  @ApiProperty({ description: 'User message for chat processing' })
  message: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Previous context for the conversation', required: false })
  context?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Session ID for tracking conversation', required: false })
  sessionId?: string;
}
