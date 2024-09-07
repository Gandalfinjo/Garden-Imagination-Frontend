import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as L from "leaflet";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnInit {
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    if (this.address) {
      this.getCoordinates(this.address);
    }
  }

  @Input() address: string = "";
  lat: number = 44.7872;
  lng: number = 20.4573;
  map!: L.Map;
  marker!: L.Marker;
  mapInitialized: boolean = false;

  ngAfterViewInit(): void {
   this.initMap();
  }

  initMap(): void {
    if (this.mapInitialized) {
      this.map.setView([this.lat, this.lng], 13);
      this.marker.setLatLng([this.lat, this.lng]);
      return;
    }

    this.map = L.map('map').setView([this.lat, this.lng], 13);
    this.mapInitialized = true;

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    const customIcon = L.icon({
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [28, 45],
      shadowSize: [30, 34],
      iconAnchor: [14, 45],
      shadowAnchor: [15, 34],
      popupAnchor: [0, -45]
    });

    this.marker = L.marker([this.lat, this.lng], { icon: customIcon }).addTo(this.map);
    this.marker.bindPopup("Firm Location");
  }

  getCoordinates(address: string): void {
    console.log(address);
    const encodedAddress = encodeURIComponent(address);
    console.log(encodedAddress);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;

    this.http.get<any[]>(url).subscribe(response => {
      if (response.length > 0) {
        this.lat = parseFloat(response[0].lat);
        this.lng = parseFloat(response[0].lon);
        this.initMap();
      }
    });
  }

}
