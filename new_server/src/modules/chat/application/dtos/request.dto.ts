import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';

export class ProcessChatDto {
  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  context?: string;

  @IsString()
  @IsOptional()
  sessionId?: string;
}

export class GetChatHistoryDto {
  @IsOptional()
  limit?: number = 10;
}

export class GetChatSessionDto {
  @IsString()
  sessionId: string;
}
