import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favorite, FavoriteDocument } from '../../domain/entities/favorite.entity';
import { FavoriteRepository } from '../../domain/interfaces/repositories';

@Injectable()
export class MongoFavoriteRepository implements FavoriteRepository {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<FavoriteDocument>,
  ) {}

  async create(favoriteData: Partial<Favorite>): Promise<Favorite> {
    const favorite = new this.favoriteModel(favoriteData);
    return favorite.save();
  }

  async findByUserAndPlace(userId: string, placeId: string): Promise<Favorite | null> {
    return this.favoriteModel.findOne({ userId, placeId }).lean();
  }

  async findByUserId(userId: string): Promise<Favorite[]> {
    return this.favoriteModel.find({ userId }).sort({ addedAt: -1 }).lean();
  }

  async findByUserIdWithPlaces(userId: string): Promise<any[]> {
    return this.favoriteModel
      .find({ userId })
      .populate({
        path: 'placeId',
        localField: 'placeId',
        foreignField: '_id',
        select: 'name description type location address images rating status'
      })
      .sort({ addedAt: -1 })
      .lean()
      .then(favorites => 
        favorites.map(fav => ({
          ...fav,
          place: Array.isArray(fav.placeId) ? fav.placeId[0] : fav.placeId
        }))
      );
  }

  async deleteByUserAndPlace(userId: string, placeId: string): Promise<void> {
    await this.favoriteModel.deleteOne({ userId, placeId });
  }

  async findMultipleByUserAndPlaces(userId: string, placeIds: string[]): Promise<Favorite[]> {
    return this.favoriteModel.find({ 
      userId, 
      placeId: { $in: placeIds } 
    }).lean();
  }

  async getUserFavoriteStats(userId: string): Promise<any> {
    const [totalFavorites, favoritesByType, recentFavorites] = await Promise.all([
      this.favoriteModel.countDocuments({ userId }),
      
      this.favoriteModel.aggregate([
        { $match: { userId } },
        { 
          $lookup: {
            from: 'places',
            localField: 'placeId',
            foreignField: '_id',
            as: 'place'
          }
        },
        { $unwind: '$place' },
        { $group: { _id: '$place.type', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      
      this.favoriteModel
        .find({ userId })
        .populate('placeId', 'name type')
        .sort({ addedAt: -1 })
        .limit(5)
        .lean()
    ]);

    return {
      totalFavorites,
      favoritesByType,
      recentFavorites: recentFavorites.map(fav => {
        const place = fav.placeId as any;
        return {
          _id: place?._id || place,
          name: place?.name || 'Lugar no encontrado',
          type: place?.type || 'Desconocido',
          addedAt: fav.addedAt
        };
      })
    };
  }

  async countByPlaceId(placeId: string): Promise<number> {
    return this.favoriteModel.countDocuments({ placeId });
  }
}
