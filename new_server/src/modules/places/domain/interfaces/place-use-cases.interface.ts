import { CreatePlaceRequestDto } from '../../application/dtos/request/create-place.request.dto';
import { UpdatePlaceRequestDto } from '../../application/dtos/request/update-place.request.dto';
import { SoftDeletePlaceRequestDto } from '../../application/dtos/request/soft-delete-place.request.dto';
import { PlaceResponseDto } from '../../application/dtos/response/place-response.dto';

export interface CreatePlaceUseCase {
  execute(createPlaceData: CreatePlaceRequestDto): Promise<PlaceResponseDto>;
}

export interface FindAllPlacesUseCase {
  execute(type?: string): Promise<PlaceResponseDto[]>;
}

export interface FindPlaceByIdUseCase {
  execute(id: string): Promise<PlaceResponseDto>;
}

export interface SearchPlacesUseCase {
  execute(query: string): Promise<PlaceResponseDto[]>;
}

export interface GetRandomPlacesUseCase {
  execute(count?: number): Promise<PlaceResponseDto[]>;
}

export interface EnsurePlaceUseCase {
  execute(placeData: any): Promise<PlaceResponseDto>;
}

export interface UpdatePlaceUseCase {
  execute(id: string, updateData: UpdatePlaceRequestDto): Promise<PlaceResponseDto>;
}

export interface SoftDeletePlaceUseCase {
  execute(id: string, softDeleteData: SoftDeletePlaceRequestDto): Promise<{ success: boolean; message: string }>;
}

export interface ProcessChatUseCase {
  execute(message: string, context?: string, sessionId?: string, userId?: string): Promise<any>;
}

export interface GetChatHistoryUseCase {
  execute(userId: string, limit?: number): Promise<any[]>;
}

export interface GetChatSessionUseCase {
  execute(userId: string, sessionId: string): Promise<any>;
}
