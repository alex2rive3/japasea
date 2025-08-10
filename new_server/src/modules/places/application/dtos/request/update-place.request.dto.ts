import { IsOptional, IsString, IsArray, IsEnum, ValidateNested, IsNumber, IsBoolean, Min, Max, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class LocationDto {
  @IsString()
  @ApiProperty({ description: 'Location type', enum: ['Point'], default: 'Point' })
  type: 'Point';

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  @ApiProperty({ description: 'Coordinates array [longitude, latitude]', type: [Number] })
  coordinates: [number, number];
}

export class UpdatePlaceRequestDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Place name', maxLength: 100, required: false })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Place description', maxLength: 1000, required: false })
  description?: string;

  @IsOptional()
  @IsEnum(['Alojamiento', 'Gastronomía', 'Turístico', 'Compras', 'Entretenimiento', 'Desayunos y meriendas', 'Comida'])
  @ApiProperty({ 
    description: 'Place type',
    enum: ['Alojamiento', 'Gastronomía', 'Turístico', 'Compras', 'Entretenimiento', 'Desayunos y meriendas', 'Comida'],
    required: false
  })
  type?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  @ApiProperty({ description: 'Place location coordinates', type: LocationDto, required: false })
  location?: LocationDto;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Place address', required: false })
  address?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'List of amenities', type: [String], required: false })
  amenities?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'Place features', type: [String], required: false })
  features?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'Place tags', type: [String], required: false })
  tags?: string[];

  @IsOptional()
  @IsEnum(['active', 'inactive', 'pending', 'seasonal'])
  @ApiProperty({ 
    description: 'Place status', 
    enum: ['active', 'inactive', 'pending', 'seasonal'],
    required: false 
  })
  status?: string;
}
