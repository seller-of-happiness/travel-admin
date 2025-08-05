export interface Photo {
  id: string;
  url: string;
}

export interface Point {
  id: string;
  lat: number;
  lng: number;
  description?: string;
  photos: Photo[];
}

export interface Route {
  id: string;
  title: string;
  points: Point[];
}
