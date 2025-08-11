import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Entity and Schema
import { Place, PlaceSchema } from './domain/entities/place.entity';

// Repository
import { MongoPlaceRepository } from './infrastructure/repositories/mongo-place.repository';

// Use Cases implementations
import { CreatePlaceUseCaseImpl } from './application/use-cases/create-place.use-case';
import { FindAllPlacesUseCaseImpl } from './application/use-cases/find-all-places.use-case';
import { FindPlaceByIdUseCaseImpl } from './application/use-cases/find-place-by-id.use-case';
import { SearchPlacesUseCaseImpl } from './application/use-cases/search-places.use-case';
import { GetRandomPlacesUseCaseImpl } from './application/use-cases/get-random-places.use-case';
import { EnsurePlaceUseCaseImpl } from './application/use-cases/ensure-place.use-case';
import { UpdatePlaceUseCaseImpl } from './application/use-cases/update-place.use-case';
import { SoftDeletePlaceUseCaseImpl } from './application/use-cases/soft-delete-place.use-case';
import { ProcessChatUseCaseImpl } from './application/use-cases/process-chat.use-case';
import { GetChatHistoryUseCaseImpl } from './application/use-cases/get-chat-history.use-case';
import { GetChatSessionUseCaseImpl } from './application/use-cases/get-chat-session.use-case';

// Controller
import { PlacesController } from './controllers/places.controller';

// Mapper
import { PlaceMapper } from './application/mappers/place.mapper';

// Tokens
import {
  PLACE_REPOSITORY,
  CREATE_PLACE_USE_CASE,
  FIND_ALL_PLACES_USE_CASE,
  FIND_PLACE_BY_ID_USE_CASE,
  SEARCH_PLACES_USE_CASE,
  GET_RANDOM_PLACES_USE_CASE,
  ENSURE_PLACE_USE_CASE,
  UPDATE_PLACE_USE_CASE,
  SOFT_DELETE_PLACE_USE_CASE,
  PROCESS_CHAT_USE_CASE,
  GET_CHAT_HISTORY_USE_CASE,
  GET_CHAT_SESSION_USE_CASE,
} from './tokens';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Place.name, schema: PlaceSchema }
    ])
  ],
  controllers: [PlacesController],
  providers: [
    // Repository
    {
      provide: PLACE_REPOSITORY,
      useClass: MongoPlaceRepository,
    },
    
    // Use Cases
    {
      provide: CREATE_PLACE_USE_CASE,
      useClass: CreatePlaceUseCaseImpl,
    },
    {
      provide: FIND_ALL_PLACES_USE_CASE,
      useClass: FindAllPlacesUseCaseImpl,
    },
    {
      provide: FIND_PLACE_BY_ID_USE_CASE,
      useClass: FindPlaceByIdUseCaseImpl,
    },
    {
      provide: SEARCH_PLACES_USE_CASE,
      useClass: SearchPlacesUseCaseImpl,
    },
    {
      provide: GET_RANDOM_PLACES_USE_CASE,
      useClass: GetRandomPlacesUseCaseImpl,
    },
    {
      provide: ENSURE_PLACE_USE_CASE,
      useClass: EnsurePlaceUseCaseImpl,
    },
    {
      provide: UPDATE_PLACE_USE_CASE,
      useClass: UpdatePlaceUseCaseImpl,
    },
    {
      provide: SOFT_DELETE_PLACE_USE_CASE,
      useClass: SoftDeletePlaceUseCaseImpl,
    },
    {
      provide: PROCESS_CHAT_USE_CASE,
      useClass: ProcessChatUseCaseImpl,
    },
    {
      provide: GET_CHAT_HISTORY_USE_CASE,
      useClass: GetChatHistoryUseCaseImpl,
    },
    {
      provide: GET_CHAT_SESSION_USE_CASE,
      useClass: GetChatSessionUseCaseImpl,
    },
    
    // Mapper
    PlaceMapper,
  ],
  exports: [
    PLACE_REPOSITORY,
    CREATE_PLACE_USE_CASE,
    FIND_ALL_PLACES_USE_CASE,
    FIND_PLACE_BY_ID_USE_CASE,
    SEARCH_PLACES_USE_CASE,
    GET_RANDOM_PLACES_USE_CASE,
    ENSURE_PLACE_USE_CASE,
    UPDATE_PLACE_USE_CASE,
    SOFT_DELETE_PLACE_USE_CASE,
    PROCESS_CHAT_USE_CASE,
    GET_CHAT_HISTORY_USE_CASE,
    GET_CHAT_SESSION_USE_CASE,
    PlaceMapper,
  ],
})
export class PlacesModule {}
