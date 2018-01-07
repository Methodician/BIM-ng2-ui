import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  positions = [];
  editorListeners

  //  based on google example, may be better for Firestore
  outerPaths = [
    { lat: 25.774, lng: -80.190 },
    { lat: 18.466, lng: -66.118 },
    { lat: 32.321, lng: -64.757 }
  ];

  innerPaths = [
    { lat: 28.745, lng: -70.579 },
    { lat: 29.570, lng: -67.514 },
    { lat: 27.339, lng: -66.668 }
  ];

  paths = [this.outerPaths, this.innerPaths];

  //  Based on ng2ui example
  // paths = [[
  //   { lat: 25.774, lng: -80.190 },
  //   { lat: 18.466, lng: -66.118 },
  //   { lat: 32.321, lng: -64.757 }
  // ], [
  //   { lat: 28.745, lng: -70.579 },
  //   { lat: 29.570, lng: -67.514 },
  //   { lat: 27.339, lng: -66.668 }
  // ]];

  //  potentially useful polygon snapper: https://github.com/jordanarseno/polysnapper
  onPolyMouseUp(e) {
    console.log('polygon moused up', e);
    e.target.getPaths().forEach((path, index) => {
      console.log('path index:', index);
      // google.maps.event.addListener(path, 'set_at', (index, oldLatLng) => {
      //   let newLatLng = path.getAt(index);
      //   console.log('new coord:', newLatLng.toJSON());
      // });
      path.getArray().forEach((coord, index) => {
        console.log(index, coord.toJSON());
      });
    });
  }

  onPolyClick(e) {
    console.log(e.target);
    const editable = e.target.editable;
    if (editable) {
      e.target.getPaths().forEach((path, index) => {
        console.log('path index:', index);
        google.maps.event.clearListeners(path, 'set_at');
        google.maps.event.clearListeners(path, 'insert_at');
        path.getArray().forEach(latLng => {
          console.log(latLng.toJSON());
        });
      });
      e.target.setEditable(false);
    }
    else {
      e.target.getPaths().forEach((path, index) => {
        console.log('path index:', index);
        google.maps.event.addListener(path, 'set_at', (index, oldLatLng) => {
          let newLatLng = path.getAt(index);
          console.log('coord SET');
          console.log('coord index:', index);
          console.log('new coord:', newLatLng.toJSON());
        });
        google.maps.event.addListener(path, 'insert_at', (index, oldLatLng) => {
          let newLatLng = path.getAt(index);
          console.log('coord INSERTED');
          console.log('coord index:', index);
          console.log('new coord:', newLatLng.toJSON());
        });
        path.getArray().forEach((coord, index) => {
          console.log(index, coord.toJSON());
        });
      });
      e.target.setEditable(true);
    }
  }
  onMapReady(map) {
    console.log('map from ready', map);
    console.log('markers from map ready', map.markers);
  }

  onIdle(event) {
    console.log('map from idle', event.target)
  }

  onMarkerInit(marker) {
    console.log('marker from markerinit', marker);
  }

  onMapClick(event) {
    this.positions.push(event.latLng);
    event.target.panTo(event.latLng);
    console.log('event from map click', event);
    console.log('positions', this.positions);
  }
}
