import { Injectable, BadRequestException, InternalServerErrorException, Inject } from '@nestjs/common';
import { ProcessChatUseCase } from '../../domain/interfaces/place-use-cases.interface';
import { PlaceRepository } from '../../domain/interfaces/place-repository.interface';
import { PlaceMapper } from '../mappers/place.mapper';
import { PLACE_REPOSITORY } from '../../tokens';

// Simulando la integración con Google AI (se necesitará instalar la dependencia)
// import { GoogleGenAI } from '@google/genai';

@Injectable()
export class ProcessChatUseCaseImpl implements ProcessChatUseCase {
  constructor(@Inject(PLACE_REPOSITORY) private readonly placeRepository: PlaceRepository) {}

  async execute(message: string, context?: string, sessionId?: string, userId?: string): Promise<any> {
    if (!message) {
      throw new BadRequestException('El mensaje es requerido');
    }

    if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'your_google_api_key_here') {
      throw new InternalServerErrorException('Clave de API de Google no configurada');
    }

    const localPlaces = await this.placeRepository.findAll();
    
    // Asegurar que todos los lugares de la BD tengan tanto key como name
    const normalizedPlaces = localPlaces.map(place => {
      if (!place.name && place.key) {
        place.name = place.key;
      } else if (place.name && !place.key) {
        place.key = place.name;
      } else if (!place.name && !place.key && (place as any).title) {
        // Si viene con 'title' en lugar de 'name' o 'key'
        place.name = (place as any).title;
        place.key = (place as any).title;
      }
      return place;
    });
    
    // Detectar si es una consulta de plan de viaje o una consulta simple
    const isTravelPlanQuery = this.detectTravelPlan(message);
    
    let response;
    if (isTravelPlanQuery) {
      response = await this.generateTravelPlan(message, context, normalizedPlaces);
    } else {
      response = await this.generateSimpleRecommendation(message, context, normalizedPlaces);
    }

    // Normalizar SIEMPRE la respuesta antes de guardarla en historial o retornarla
    response = await this.normalizeResponse(response, true);

    // TODO: Guardar en el historial si el usuario está autenticado
    // Esto se implementará cuando tengamos el módulo de ChatHistory migrado
    if (userId) {
      try {
        const chatSessionId = sessionId || `session-${Date.now()}`;
        // await this.saveChatHistory(userId, chatSessionId, message, response, context);
        response.sessionId = chatSessionId;
      } catch (historyError) {
        console.error('Error saving chat history:', historyError);
        // No fallar la respuesta si hay error al guardar el historial
      }
    }

    return response;
  }

  private detectTravelPlan(message: string): boolean {
    const messageLower = message.toLowerCase();
    
    // Detectar menciones explícitas de días
    const dayKeywords = /(\d+)\s*(día|dias|day|days)/i;
    if (dayKeywords.test(message)) {
      return true;
    }
    
    // Detectar palabras que indican planificación de viaje
    const travelPlanKeywords = [
      'plan', 'planear', 'itinerario', 'ruta', 'recorrido', 'trip', 'viaje',
      'conocer', 'recorrer', 'turistear', 'explorar', 'visitar encarnación'
    ];
    
    // Detectar múltiples actividades (indica necesidad de plan)
    const hasMultipleActivities = messageLower.includes(' y ') && 
      (messageLower.includes('comer') || messageLower.includes('ir') || 
       messageLower.includes('visitar') || messageLower.includes('hacer'));
    
    const hasTravelKeywords = travelPlanKeywords.some(keyword => 
      messageLower.includes(keyword)
    );
    
    return hasTravelKeywords || hasMultipleActivities;
  }

  private detectLanguage(message: string): string {
    const messageLower = message.toLowerCase();
    
    // Palabras clave en español
    const spanishKeywords = ['donde', 'dónde', 'que', 'qué', 'como', 'cómo', 'cuando', 'cuándo', 'quiero', 'busco', 'necesito', 'puedo', 'restaurante', 'hotel', 'lugar', 'comida', 'comer', 'visitar', 'hacer', 'ir', 'ver', 'conocer', 'recomendar', 'recomendación', 'plan', 'viaje', 'turismo', 'actividad', 'lugares'];
    
    // Palabras clave en portugués
    const portugueseKeywords = ['onde', 'que', 'como', 'quando', 'quero', 'procuro', 'preciso', 'posso', 'restaurante', 'hotel', 'lugar', 'comida', 'comer', 'visitar', 'fazer', 'ir', 'ver', 'conhecer', 'recomendar', 'recomendação', 'plano', 'viagem', 'turismo', 'atividade', 'lugares', 'gostaria', 'gosto'];
    
    // Palabras clave en inglés
    const englishKeywords = ['where', 'what', 'how', 'when', 'want', 'looking', 'need', 'can', 'restaurant', 'hotel', 'place', 'food', 'eat', 'visit', 'do', 'go', 'see', 'know', 'recommend', 'recommendation', 'plan', 'trip', 'travel', 'tourism', 'activity', 'places', 'would', 'like'];
    
    let spanishScore = 0;
    let portugueseScore = 0;
    let englishScore = 0;
    
    // Contar coincidencias
    spanishKeywords.forEach(keyword => {
      if (messageLower.includes(keyword)) spanishScore++;
    });
    
    portugueseKeywords.forEach(keyword => {
      if (messageLower.includes(keyword)) portugueseScore++;
    });
    
    englishKeywords.forEach(keyword => {
      if (messageLower.includes(keyword)) englishScore++;
    });
    
    // Determinar idioma basado en mayor puntaje
    if (spanishScore >= portugueseScore && spanishScore >= englishScore) {
      return 'es';
    } else if (portugueseScore > spanishScore && portugueseScore >= englishScore) {
      return 'pt';
    } else if (englishScore > spanishScore && englishScore > portugueseScore) {
      return 'en';
    }
    
    // Por defecto inglés si no se puede determinar
    return 'en';
  }

  private getLanguageConfig(language: string) {
    const configs = {
      'es': {
        languageInstruction: 'Responde en español natural y amigable',
        messageInstruction: 'Respuesta concisa en español',
        titleSuffix: 'para tu consulta',
        examples: {
          query: '¿Dónde puedo comer buena pizza?',
          expected: '3-4 pizzerías específicas de Encarnación'
        }
      },
      'en': {
        languageInstruction: 'Always respond in natural and friendly English',
        messageInstruction: 'Concise response in English',
        titleSuffix: 'for your query',
        examples: {
          query: 'Where can I eat good pizza?',
          expected: '3-4 specific pizzerias in Encarnación'
        }
      },
      'pt': {
        languageInstruction: 'Sempre responda em português natural e amigável',
        messageInstruction: 'Resposta concisa em português',
        titleSuffix: 'para sua consulta',
        examples: {
          query: 'Onde posso comer boa pizza?',
          expected: '3-4 pizzarias específicas de Encarnación'
        }
      }
    };
    
    return configs[language] || configs['en'];
  }

  private async generateTravelPlan(message: string, context: string, localPlaces: any[]): Promise<any> {
    // TODO: Implementar la integración con Google AI
    // Esta implementación sería idéntica a la del controlador original
    // Por ahora devuelvo un plan fallback
    return this.generateFallbackTravelPlan(message);
  }

  private async generateSimpleRecommendation(message: string, context: string, localPlaces: any[]): Promise<any> {
    // TODO: Implementar la integración con Google AI
    // Esta implementación sería idéntica a la del controlador original
    // Por ahora devuelvo recomendaciones fallback
    return this.generateFallbackRecommendation(message, localPlaces);
  }

  private async normalizeResponse(response: any, shouldResolveReferences: boolean = false): Promise<any> {
    if (!response || typeof response !== 'object') return response;
    
    const normalized = { ...response };
    
    if (normalized.places && Array.isArray(normalized.places)) {
      normalized.places = normalized.places.map(place => PlaceMapper.normalizePlace(place));
    }
    
    if (normalized.travelPlan && normalized.travelPlan.days) {
      normalized.travelPlan = { ...normalized.travelPlan };
      const inputDays = Array.isArray(normalized.travelPlan.days) ? normalized.travelPlan.days : [];
      
      normalized.travelPlan.days = await Promise.all(inputDays.map(async (day, dayIndex) => {
        if (!day || !day.activities) return day;
        
        const inputActivities = Array.isArray(day.activities) ? day.activities : [];
        const activities = await Promise.all(inputActivities.map(async activity => {
          let place = activity.place;
          
          // Si place es un string (ID), resolverlo a objeto completo
          if (shouldResolveReferences && typeof place === 'string') {
            try {
              const foundPlace = await this.placeRepository.findById(place);
              if (foundPlace) {
                place = foundPlace;
              } else {
                // Si no se encuentra el lugar por ID, crear un lugar placeholder
                place = {
                  _id: place,
                  id: place,
                  key: 'Lugar no encontrado',
                  name: 'Lugar no encontrado',
                  description: 'Este lugar ya no está disponible en nuestra base de datos',
                  address: 'Dirección no disponible',
                  type: 'unknown',
                  location: { lat: -27.3309, lng: -55.8663 }
                };
              }
            } catch (error) {
              console.error('Error resolving place reference:', error);
              // Crear lugar placeholder en caso de error
              place = {
                _id: place,
                id: place,
                key: 'Lugar no disponible',
                name: 'Lugar no disponible',
                description: 'Error al cargar la información del lugar',
                address: 'Dirección no disponible',
                type: 'unknown',
                location: { lat: -27.3309, lng: -55.8663 }
              };
            }
          }
          
          return {
            ...activity,
            place: PlaceMapper.normalizePlace(place)
          };
        }));
        
        return {
          ...day,
          dayNumber: typeof day.dayNumber === 'number' ? day.dayNumber : (dayIndex + 1),
          activities: activities
        };
      }));

      // Asegurar totalDays coherente
      if (
        typeof normalized.travelPlan.totalDays !== 'number' ||
        normalized.travelPlan.totalDays <= 0
      ) {
        normalized.travelPlan.totalDays = normalized.travelPlan.days.length;
      }
    }
    
    return normalized;
  }

  private generateFallbackTravelPlan(message: string): any {
    // Detectar si se mencionan días específicos en el mensaje
    const dayMatches = message.match(/(\d+)\s*(día|dias|day|days)/i);
    const totalDays = dayMatches ? parseInt(dayMatches[1]) : 1;
    
    return {
      message: `He preparado un plan de ${totalDays} día${totalDays > 1 ? 's' : ''} para tu visita a Encarnación. Los lugares son recomendaciones generales que puedes ajustar según tus preferencias específicas.`,
      travelPlan: {
        totalDays: totalDays,
        days: [
          {
            dayNumber: 1,
            title: totalDays === 1 ? "Día Completo en Encarnación" : "Llegada y Centro Histórico",
            activities: [
              {
                time: "09:00",
                category: "Desayuno",
                place: {
                  key: "Café Central Encarnación",
                  name: "Café Central Encarnación",
                  type: "Desayunos y meriendas",
                  description: "Café céntrico perfecto para comenzar el día con un buen desayuno paraguayo",
                  address: "Avda. Dr. Francia c/ 14 de Mayo",
                  location: { lat: -27.3309, lng: -55.8663 }
                }
              },
              {
                time: "11:00",
                category: "Turismo",
                place: {
                  key: "Plaza de Armas",
                  name: "Plaza de Armas",
                  type: "Turístico",
                  description: "Plaza central histórica con monumentos y ambiente tradicional",
                  address: "14 de Mayo c/ Mcal. Estigarribia",
                  location: { lat: -27.3323, lng: -55.8656 }
                }
              },
              {
                time: "13:00",
                category: "Almuerzo",
                place: {
                  key: "Restaurante La Costanera",
                  name: "Restaurante La Costanera",
                  type: "Gastronomía",
                  description: "Restaurante con vista al río y especialidades locales",
                  address: "Avda. Costanera",
                  location: { lat: -27.3340, lng: -55.8737 }
                }
              },
              {
                time: "15:30",
                category: "Turismo",
                place: {
                  key: "Costanera de Encarnación",
                  name: "Costanera de Encarnación",
                  type: "Turístico",
                  description: "Hermoso paseo junto al río Paraná con vistas panorámicas",
                  address: "Avda. Costanera",
                  location: { lat: -27.3350, lng: -55.8740 }
                }
              },
              {
                time: "19:00",
                category: "Cena",
                place: {
                  key: "Paseo Gastronómico",
                  name: "Paseo Gastronómico",
                  type: "Gastronomía",
                  description: "Zona gastronómica con variedad de restaurantes y ambiente nocturno",
                  address: "Avda. Francia",
                  location: { lat: -27.3353, lng: -55.8716 }
                }
              }
            ]
          }
        ]
      },
      timestamp: new Date().toISOString()
    };
  }

  private generateFallbackRecommendation(message: string, localPlaces: any[]): any {
    const places = (localPlaces && localPlaces.length > 0)
      ? localPlaces.slice(0, 4)
      : [
          {
            key: "Costanera de Encarnación",
            name: "Costanera de Encarnación",
            type: "Turístico",
            description: "Hermosa costanera con vista al río Paraná, ideal para pasear y disfrutar",
            address: "Avda. Costanera",
            location: { lat: -27.3340, lng: -55.8737 }
          },
          {
            key: "Paseo Gastronómico",
            name: "Paseo Gastronómico",
            type: "Gastronomía",
            description: "Zona gastronómica con variedad de restaurantes y opciones culinarias",
            address: "Avda. Francia",
            location: { lat: -27.3353, lng: -55.8716 }
          },
          {
            key: "Shopping Costanera",
            name: "Shopping Costanera",
            type: "Compras",
            description: "Centro comercial moderno con tiendas, restaurantes y entretenimiento",
            address: "Avda. Costanera",
            location: { lat: -27.3253, lng: -55.8754 }
          }
        ];

    return {
      message: "Aquí tienes algunas recomendaciones para tu visita a Encarnación.",
      places,
      timestamp: new Date().toISOString()
    };
  }
}
