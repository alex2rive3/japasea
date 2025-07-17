export interface Place {
  key: string
  description: string
  location: {
    lat: number
    lng: number
  }
  type: string
  address: string
}

export interface PlacesResponse {
  places: Place[]
  message: string
}
