import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BoundingBox, MapState} from '@shared/map/model';
import {
  geoJSON,
  icon as LeafletIcon,
  latLng,
  LatLngBounds,
  Layer,
  Map as LeafletMap,
  Marker as LeafletMarker,
  tileLayer
} from 'leaflet';
import {GeoJSON} from 'geojson'
import {createApiCallDeferrer} from '@shared/dialog/dialog-utils';

const iconRetinaUrl = 'assets/th.png';
const iconUrl = 'assets/th.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = LeafletIcon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 25],
  iconAnchor: [10, 10],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [25, 25]
});

LeafletMarker.prototype.options.icon = iconDefault;

const privateWayLineStyle = {
  "color": "#FF0000",
  "weight": 5,
  "opacity": 0.9
};

@Component({
  selector: 'psm-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.scss']
})
export class MapViewerComponent {
  bounds: LatLngBounds | null = null;
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {maxZoom: 19, attribution: 'OpenStreetMap'})
    ],
  };

  @Output()
  psmEditorClick = new EventEmitter<MapState>();

  private leafletMapCaller = createApiCallDeferrer<LeafletMap>()
  private referenceObjectLayers: Layer[] = [];

  @Input()
  set boundingBox(newBoundingBox: BoundingBox | null | undefined) {
    this.bounds = newBoundingBox ? new LatLngBounds(
      latLng(newBoundingBox.southernEdgeLat, newBoundingBox.westernEdgeLong),
      latLng(newBoundingBox.northernEdgeLat, newBoundingBox.easternEdgeLong)) : null;
  }

  @Input()
  set referenceObjectsAsGeoJson(referenceObjects: GeoJSON[]) {
    this.removeLayersFromMap();
    this.addLayersOf(referenceObjects);
  }

  onMapReady(map: LeafletMap) {
    this.leafletMapCaller.onApiReady(map);
  }

  notifyOnPsmClick() {
    this.leafletMapCaller.execute(map => {
      const centerPosition = map.getCenter();
      this.psmEditorClick.emit({
        zoom: map.getZoom(),
        lat: centerPosition.lat,
        long: centerPosition.lng,
      });
    });
  }

  private removeLayersFromMap() {
    this.leafletMapCaller.execute(
      map => this.referenceObjectLayers.forEach(referenceObjectLayer => map.removeLayer(referenceObjectLayer)));
  }

  private addLayersOf(referenceObjects: GeoJSON[]) {
    if (referenceObjects) {
      this.leafletMapCaller.execute(map => this.referenceObjectLayers = referenceObjects.map(
        referenceObject => geoJSON(referenceObject, {style: privateWayLineStyle}).addTo(map)))
    }
  }
}
