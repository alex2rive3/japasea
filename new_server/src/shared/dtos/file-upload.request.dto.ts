import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class UploadImageRequestDto {
  @ApiProperty({
    description: 'Descripción de la imagen',
    example: 'Vista principal del restaurante',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description?: string;

  @ApiProperty({
    description: 'Categoría de la imagen',
    example: 'exterior',
    enum: ['exterior', 'interior', 'food', 'menu', 'other'],
    required: false
  })
  @IsOptional()
  @IsString({ message: 'La categoría debe ser una cadena de texto' })
  category?: string;
}

export class BulkUploadRequestDto {
  @ApiProperty({
    description: 'Array de descripciones para cada imagen',
    example: ['Vista principal', 'Interior del local'],
    required: false
  })
  @IsOptional()
  @IsArray({ message: 'Las descripciones deben ser un array' })
  @IsString({ each: true, message: 'Cada descripción debe ser una cadena de texto' })
  descriptions?: string[];

  @ApiProperty({
    description: 'Categoría común para todas las imágenes',
    example: 'exterior',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'La categoría debe ser una cadena de texto' })
  category?: string;
}
