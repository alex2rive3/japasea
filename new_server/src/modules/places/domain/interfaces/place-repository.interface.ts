import { Place } from '../entities/place.entity';

export interface PlaceRepository {
  create(placeData: Partial<Place>): Promise<Place>;
  findAll(filters?: any): Promise<Place[]>;
  findById(id: string): Promise<Place | null>;
  findByKey(key: string): Promise<Place | null>;
  findOne(query: any): Promise<Place | null>;
  search(query: string): Promise<Place[]>;
  getRandomPlaces(count: number): Promise<Place[]>;
  update(id: string, updateData: Partial<Place>): Promise<Place | null>;
  softDelete(id: string, reason?: string): Promise<boolean>;
  countDocuments(filter: any): Promise<number>;
  getTopPlacesByReviews(limit: number): Promise<any[]>;
  getPlacesByType(): Promise<Array<{ _id: string; count: number }>>;
}
