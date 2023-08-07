export interface BoundingBox {
  westernEdgeLong: number;
  southernEdgeLat: number;
  easternEdgeLong: number;
  northernEdgeLat: number;
}

export interface MapState {
  zoom: number;
  lat: number;
  long: number;
}
