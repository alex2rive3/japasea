import { IsString, IsArray, IsOptional, IsEnum, ValidateNested, IsNumber, IsBoolean, Min, Max, ArrayMinSize, ArrayMaxSize } from 'class-validator';
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

class ContactDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Phone number', required: false })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Email address', required: false })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Website URL', required: false })
  website?: string;

  @IsOptional()
  @ApiProperty({ description: 'Social media links', required: false })
  social?: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
}

class ImageDto {
  @IsString()
  @ApiProperty({ description: 'Image URL' })
  url: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Image caption', required: false })
  caption?: string;

  @IsBoolean()
  @ApiProperty({ description: 'Is primary image' })
  isPrimary: boolean;
}

class BusinessHourDto {
  @IsNumber()
  @Min(0)
  @Max(6)
  @ApiProperty({ description: 'Day of week (0=Sunday, 6=Saturday)' })
  day: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Opening time (HH:MM)', required: false })
  open?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Closing time (HH:MM)', required: false })
  close?: string;

  @IsBoolean()
  @ApiProperty({ description: 'Is closed on this day' })
  isClosed: boolean;
}

export class CreatePlaceRequestDto {
  @IsString()
  @ApiProperty({ description: 'Unique place key' })
  key: string;

  @IsString()
  @ApiProperty({ description: 'Place name', maxLength: 100 })
  name: string;

  @IsString()
  @ApiProperty({ description: 'Place description', maxLength: 1000 })
  description: string;

  @IsEnum(['Alojamiento', 'Gastronomía', 'Turístico', 'Compras', 'Entretenimiento', 'Desayunos y meriendas', 'Comida'])
  @ApiProperty({ 
    description: 'Place type',
    enum: ['Alojamiento', 'Gastronomía', 'Turístico', 'Compras', 'Entretenimiento', 'Desayunos y meriendas', 'Comida']
  })
  type: string;

  @ValidateNested()
  @Type(() => LocationDto)
  @ApiProperty({ description: 'Place location coordinates', type: LocationDto })
  location: LocationDto;

  @IsString()
  @ApiProperty({ description: 'Place address' })
  address: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ContactDto)
  @ApiProperty({ description: 'Contact information', type: ContactDto, required: false })
  contact?: ContactDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'List of amenities', type: [String], required: false })
  amenities?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  @ApiProperty({ description: 'Place images', type: [ImageDto], required: false })
  images?: ImageDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessHourDto)
  @ApiProperty({ description: 'Business hours', type: [BusinessHourDto], required: false })
  businessHours?: BusinessHourDto[];

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
    default: 'active',
    required: false 
  })
  status?: string;
}
