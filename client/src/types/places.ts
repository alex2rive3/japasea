export interface Place {
  _id?: string // ID de MongoDB
  key: string
  description: string
  location: {
    lat: number
    lng: number
  }
  type?: string // Hacer opcional para manejar casos donde no esté definido
  address: string
}

export interface PlacesResponse {
  places: Place[]
  message: string
}

export interface TravelActivity {
  time: string
  category?: string // Hacer opcional para manejar casos donde no esté definido
  place: Place
}

export interface TravelDay {
  dayNumber: number
  title: string
  activities: TravelActivity[]
}

export interface TravelPlan {
  totalDays: number
  days: TravelDay[]
}

export interface TravelPlanResponse {
  message: string
  travelPlan: TravelPlan
  timestamp: string
}

export interface SimpleRecommendationResponse {
  message: string
  places: Place[]
  timestamp: string
}

export interface ChatResponse {
  message?: string
  response?: string
  places?: Place[]
  travelPlan?: TravelPlan
  timestamp: string
  sessionId?: string
}
