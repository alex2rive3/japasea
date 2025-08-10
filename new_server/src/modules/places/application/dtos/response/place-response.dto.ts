import { ApiProperty } from '@nestjs/swagger';
import { Location, Contact, Image, BusinessHour, Rating, Pricing, PlaceMetadata, SeasonalInfo } from '../../domain/entities/place.entity';

export class PlaceResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  type: string;

  @ApiProperty({ type: Object })
  location: Location;

  @ApiProperty()
  address: string;

  @ApiProperty({ type: Object, required: false })
  contact?: Contact;

  @ApiProperty({ type: [String] })
  amenities: string[];

  @ApiProperty({ type: [Object] })
  images: Image[];

  @ApiProperty({ type: [Object] })
  businessHours: BusinessHour[];

  @ApiProperty({ type: Object })
  rating: Rating;

  @ApiProperty({ type: Object })
  pricing: Pricing;

  @ApiProperty({ type: [String] })
  features: string[];

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty()
  status: string;

  @ApiProperty({ type: Object })
  metadata: PlaceMetadata;

  @ApiProperty({ type: Object, required: false })
  seasonalInfo?: SeasonalInfo;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
