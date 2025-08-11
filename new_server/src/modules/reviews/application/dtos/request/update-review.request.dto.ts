import { IsString, IsNumber, IsOptional, IsArray, Min, Max, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewRequestDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @ApiProperty({ description: 'Rating from 1 to 5', minimum: 1, maximum: 5, required: false })
  rating?: number;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  @ApiProperty({ description: 'Review comment', minLength: 10, maxLength: 1000, required: false })
  comment?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'Array of image URLs', type: [String], required: false })
  images?: string[];
}
