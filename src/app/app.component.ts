import { Component, ViewChild, OnInit } from '@angular/core';
import { DrawingManager } from '@ngui/map';
import { MapService } from './services/map.service';
import { Polygon } from '@ngui/map/dist/directives/polygon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(DrawingManager) drawingManager: DrawingManager;
  positions = [];
  selectedOverlay: any;

  polygons: any;


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

  constructor(private mapSvc: MapService) { }
  ngOnInit() {
    this.mapSvc.getPolygons().valueChanges().subscribe((polygons: Polygon[]) => {
      this.polygons = polygons;
    })
    this.drawingManager['initialized$'].subscribe(dm => {
      google.maps.event.addListener(dm, 'overlaycomplete', event => {
        console.log('drawing manager', dm);
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
          dm.setDrawingMode(null);
          console.log(event);
          event.overlay.setEditable(false);
          google.maps.event.addListener(event.overlay, 'mouseup', e => {
            this.onPolyMouseUp(event.overlay);
          });
          google.maps.event.addListener(event.overlay, 'rightclick', e => {
            this.onPolyRightClick(event.overlay);
          });
        }
      })
    })
  }

  deleteSelectedOverlay() {
    if (this.selectedOverlay) {
      this.selectedOverlay.setMap(null);
      delete this.selectedOverlay;
    }
  }

  //  potentially useful polygon snapper: https://github.com/jordanarseno/polysnapper
  onPolyMouseUp(e) {
    // console.log('polygon moused up', e);
    // e.getPaths().forEach((path, index) => {
    //   // console.log('path index:', index);
    //   path.getArray().forEach((coord, index) => {
    //     // console.log(index, coord.toJSON());
    //   });
    // });
  }

  onPolyRightClick(e, polygon?) {
    console.log('poly rigth click polygon', polygon);
    console.log('poly right click event', e);
    const editable = e.editable;
    if (editable) {
      this.selectedOverlay = null;

      e.getPaths().forEach((path, index) => {
        // console.log('path index:', index);
        google.maps.event.clearListeners(path, 'set_at');
        google.maps.event.clearListeners(path, 'insert_at');
        let newPaths = path.getArray().map(latLng => latLng.toJSON());
        console.log('newPaths:', newPaths);
        // path.getArray().forEach(latLng => {
        //   //  can save from here. Getting latest paths.
        //   //  May not need all the listeners for set and insert after all?
        //   console.log(latLng.toJSON());
        // });
        if (polygon && polygon.id) {
          polygon.paths = newPaths;
          this.mapSvc.updatePolygonPaths(polygon);
        }
        else {
          let polygon = { paths: newPaths };
          this.mapSvc.addPolygon(polygon);
        }
      });
      e.setEditable(false);
      e.setDraggable(false);
    }
    else {
      this.selectedOverlay = e;
      e.getPaths().forEach((path, index) => {
        // console.log('path index:', index);
        google.maps.event.addListener(path, 'set_at', (index, oldLatLng) => {
          let newLatLng = path.getAt(index);
          // console.log('coord SET');
          // console.log('coord index:', index);
          // console.log('new coord:', newLatLng.toJSON());
        });
        google.maps.event.addListener(path, 'insert_at', (index, oldLatLng) => {
          let newLatLng = path.getAt(index);
          // console.log('coord INSERTED');
          // console.log('coord index:', index);
          // console.log('new coord:', newLatLng.toJSON());
        });
        path.getArray().forEach((coord, index) => {
          console.log(index, coord.toJSON());
        });
      });
      e.setEditable(true);
      e.setDraggable(true);
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
    // this.positions.push(event.latLng);
    // event.target.panTo(event.latLng);
    // console.log('event from map click', event);
    // console.log('positions', this.positions);
  }
}
