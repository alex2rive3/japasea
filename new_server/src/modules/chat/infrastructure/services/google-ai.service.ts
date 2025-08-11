import { Injectable } from '@nestjs/common';

export interface GoogleAIResponse {
  message: string;
  places?: any[];
  travelPlan?: any;
}

@Injectable()
export class GoogleAIService {
  async processMessage(message: string, context?: string): Promise<GoogleAIResponse> {
    // TODO: Integrar con Google AI (Gemini) API
    // Por ahora, simulamos una respuesta
    
    console.log(`Processing message: "${message}" with context: "${context}"`);
    
    // Simulación de respuesta basada en el contenido del mensaje
    if (message.toLowerCase().includes('restaurante') || message.toLowerCase().includes('comida')) {
      return {
        message: 'Aquí tienes algunas recomendaciones de restaurantes en la zona:',
        places: [
          {
            _id: 'rest1',
            name: 'Restaurante Demo',
            description: 'Deliciosa comida local',
            category: 'restaurant',
            rating: 4.5,
            address: 'Calle Demo 123'
          }
        ]
      };
    }
    
    if (message.toLowerCase().includes('plan') || message.toLowerCase().includes('itinerario')) {
      return {
        message: 'He creado un plan de viaje personalizado para ti:',
        travelPlan: {
          title: 'Plan de Viaje Demo',
          duration: '3 días',
          totalDays: 3,
          days: [
            {
              dayNumber: 1,
              title: 'Día 1 - Exploración',
              description: 'Conoce los lugares principales',
              activities: [
                {
                  time: '9:00 AM',
                  category: 'sightseeing',
                  place: {
                    name: 'Plaza Central',
                    description: 'Centro histórico de la ciudad'
                  },
                  duration: '2 horas',
                  tips: ['Lleva cámara', 'Usa zapatos cómodos']
                }
              ]
            }
          ],
          budget: {
            total: '$200 USD',
            breakdown: [
              { category: 'Alimentación', amount: '$80' },
              { category: 'Transporte', amount: '$50' },
              { category: 'Actividades', amount: '$70' }
            ]
          },
          recommendations: ['Lleva protector solar', 'Descarga mapas offline']
        }
      };
    }
    
    // Respuesta genérica
    return {
      message: `Gracias por tu consulta sobre "${message}". Estoy aquí para ayudarte a descubrir lugares increíbles y planificar tu viaje perfecto. ¿En qué más puedo asistirte?`
    };
  }
}
