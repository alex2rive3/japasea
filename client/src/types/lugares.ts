export interface Lugar {
  key: string
  description: string
  location: {
    lat: number
    lng: number
  }
  type: string
  address: string
}

export interface LugaresResponse {
  lugares: Lugar[]
  message: string
}
