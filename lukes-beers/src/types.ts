export interface MapVenue {
  name: string
  lat: number
  lng: number
  country: string
  city: string
  avg_rating: number
  checkins: number
  top_beers: { beer: string; brewery: string; rating: number; style: string }[]
}

export interface StyleStat {
  style: string
  count: number
  avg_rating: number
  avg_deviation: number
}

export interface BeerDeviation {
  beer: string
  brewery: string
  style: string
  his: number
  avg: number
  dev: number
}

export interface Brewery {
  name: string
  count: number
  avg_rating: number
}

export interface UntappdData {
  hero: {
    total_beers: number
    avg_rating: number
    unique_breweries: number
    unique_venues: number
    countries: Record<string, number>
    countries_count: number
  }
  map_venues: MapVenue[]
  styles: StyleStat[]
  loved: BeerDeviation[]
  snubbed: BeerDeviation[]
  top_breweries: Brewery[]
}
