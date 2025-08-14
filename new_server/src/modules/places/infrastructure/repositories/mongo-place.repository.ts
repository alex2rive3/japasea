import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Place } from '../../domain/entities/place.entity';
import { PlaceRepository } from '../../domain/interfaces/place-repository.interface';

@Injectable()
export class MongoPlaceRepository implements PlaceRepository {
  constructor(
    @InjectModel(Place.name) private readonly placeModel: Model<Place>
  ) {}

  async create(placeData: Partial<Place>): Promise<Place> {
    const place = new this.placeModel(placeData);
    return place.save();
  }

  async findAll(filters?: any): Promise<Place[]> {
    const query = { status: 'active', ...filters };
    return this.placeModel
      .find(query)
      .select('-__v')
      .sort({ 'rating.average': -1, 'metadata.views': -1 })
      .lean()
      .exec();
  }

  async findById(id: string): Promise<Place | null> {
    return this.placeModel
      .findById(id)
      .select('-__v')
      .lean()
      .exec();
  }

  async findByKey(key: string): Promise<Place | null> {
    return this.placeModel
      .findOne({ key })
      .select('-__v')
      .lean()
      .exec();
  }

  async findOne(query: any): Promise<Place | null> {
    return this.placeModel
      .findOne(query)
      .select('-__v')
      .lean()
      .exec();
  }

  async search(query: string): Promise<Place[]> {
    return this.placeModel
      .find({
        $and: [
          { status: 'active' },
          {
            $or: [
              { name: new RegExp(query, 'i') },
              { description: new RegExp(query, 'i') },
              { type: new RegExp(query, 'i') },
              { address: new RegExp(query, 'i') },
              { tags: new RegExp(query, 'i') }
            ]
          }
        ]
      })
      .select('-__v')
      .lean()
      .exec();
  }

  async getRandomPlaces(count: number): Promise<Place[]> {
    return this.placeModel.aggregate([
      { $match: { status: 'active' } },
      { $sample: { size: count } },
      { $project: { __v: 0 } }
    ]);
  }

  async update(id: string, updateData: Partial<Place>): Promise<Place | null> {
    return this.placeModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-__v')
      .lean()
      .exec();
  }

  async softDelete(id: string, reason?: string): Promise<boolean> {
    const result = await this.placeModel.updateOne(
      { _id: id },
      { 
        status: 'inactive',
        'metadata.lastUpdated': new Date(),
        ...(reason && { deleteReason: reason })
      }
    );
    return result.modifiedCount > 0;
  }

  async countDocuments(filter: any): Promise<number> {
    return this.placeModel.countDocuments(filter).exec();
  }

  async getTopPlacesByReviews(limit: number): Promise<any[]> {
    return this.placeModel
      .find({ status: 'active' })
      .sort({ 'rating.average': -1, 'rating.count': -1 })
      .limit(limit)
      .select('name key rating location.address')
      .lean()
      .exec();
  }

  async getPlacesByType(): Promise<Array<{ _id: string; count: number }>> {
    return this.placeModel.aggregate([
      {
        $match: { status: 'active' }
      },
      {
        $group: {
          _id: '$details.type',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]).exec();
  }
}
