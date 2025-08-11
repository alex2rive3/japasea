import { Injectable } from '@nestjs/common';
import { Place } from '../../domain/entities/place.entity';
import { PlaceResponseDto } from '../dtos/response/place-response.dto';
import { CreatePlaceRequestDto } from '../dtos/request/create-place.request.dto';

@Injectable()
export class PlaceMapper {
  
  static toResponseDto(place: Place): PlaceResponseDto {
    return {
      _id: (place as any)._id?.toString() || (place as any).id,
      key: place.key,
      name: place.name,
      description: place.description,
      type: place.type,
      location: place.location,
      address: place.address,
      contact: place.contact,
      amenities: place.amenities || [],
      images: place.images || [],
      businessHours: place.businessHours || [],
      rating: place.rating || { average: 0, count: 0 },
      pricing: place.pricing || { level: 2, currency: 'PYG' },
      features: place.features || [],
      tags: place.tags || [],
      status: place.status,
      metadata: place.metadata || {
        views: 0,
        likes: 0,
        bookmarks: 0,
        verified: false,
        featured: false,
        lastUpdated: new Date()
      },
      seasonalInfo: place.seasonalInfo,
      createdAt: place.createdAt,
      updatedAt: place.updatedAt
    };
  }

  static toEntity(createDto: CreatePlaceRequestDto): Partial<Place> {
    return {
      key: createDto.key,
      name: createDto.name,
      description: createDto.description,
      type: createDto.type,
      location: createDto.location,
      address: createDto.address,
      contact: createDto.contact,
      amenities: createDto.amenities || [],
      images: createDto.images || [],
      businessHours: createDto.businessHours || [],
      rating: { average: 0, count: 0 },
      pricing: { level: 2, currency: 'PYG' },
      features: createDto.features || [],
      tags: createDto.tags || [],
      status: createDto.status || 'active',
      metadata: {
        views: 0,
        likes: 0,
        bookmarks: 0,
        verified: false,
        featured: false,
        lastUpdated: new Date()
      }
    };
  }

  static mapToValidPlaceType(rawType: string): string {
    const allowed = [
      'Alojamiento',
      'Gastronomía',
      'Turístico',
      'Compras',
      'Entretenimiento',
      'Desayunos y meriendas',
      'Comida'
    ];
    
    if (!rawType || typeof rawType !== 'string') return 'Gastronomía';
    
    const t = rawType.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    const direct = {
      alojamiento: 'Alojamiento',
      gastronomia: 'Gastronomía',
      turistico: 'Turístico',
      compras: 'Compras',
      entretenimiento: 'Entretenimiento',
      'desayunos y meriendas': 'Desayunos y meriendas',
      comida: 'Comida'
    };
    
    if (direct[t]) return direct[t];
    
    if (t.includes('hotel') || t.includes('aloj') || t.includes('hostel')) return 'Alojamiento';
    if (t.includes('desayuno') || t.includes('merienda') || t.includes('cafe')) return 'Desayunos y meriendas';
    if (t.includes('tur') || t.includes('museo') || t.includes('plaza') || t.includes('playa') || t.includes('ruina') || t.includes('mirador') || t.includes('parque')) return 'Turístico';
    if (t.includes('shopping') || t.includes('compras') || t.includes('tienda')) return 'Compras';
    if (t.includes('entreten') || t.includes('pub') || t.includes('discot') || t.includes('bar') || t.includes('rooftop')) return 'Entretenimiento';
    if (t.includes('rest') || t.includes('gastr') || t.includes('comida') || t.includes('pizza') || t.includes('sushi') || t.includes('churras') || t.includes('parrilla') || t.includes('almuerzo') || t.includes('cena')) return 'Comida';
    
    return 'Gastronomía';
  }

  static normalizePlace(rawPlace: any): any {
    if (!rawPlace || typeof rawPlace !== 'object') return rawPlace;
    
    const place = { ...rawPlace };
    
    if (!place.name && place.key) {
      place.name = place.key;
    } else if (place.name && !place.key) {
      place.key = place.name;
    } else if (!place.name && !place.key) {
      place.name = 'Lugar por definir';
      place.key = 'Lugar por definir';
    }
    
    if (!place.category && place.type) {
      place.category = place.type;
    }
    
    if (!place.description) {
      place.description = 'Descripción no disponible';
    }
    
    if (!place.address) {
      place.address = 'Dirección por confirmar';
    }
    
    if (!place.location || typeof place.location.lat !== 'number' || typeof place.location.lng !== 'number') {
      place.location = { lat: -27.3309, lng: -55.8663 };
    }
    
    return place;
  }
}
