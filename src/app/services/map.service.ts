import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as fb from 'firebase';

@Injectable()
export class MapService {

  constructor(private db: AngularFirestore) { }

  getPolygons() {
    return this.db.collection('polygons');
  }

  getPolygonById(id: string) {
    return this.getPolygons().doc(id);
  }

  addPolygon(polygon) {
    let id = this.db.createId();
    polygon.id = id;
    return this.getPolygonById(id).set(polygon);
  }

  updatePolygon(polygon) {
    return this.getPolygonById(polygon.id).update(polygon);
  }

  updatePolygonPaths(polygon) {
    const stubPolygon = { ...polygon };
    stubPolygon.paths = fb.firestore.FieldValue.delete();
    const polyRef = this.getPolygonById(polygon.id).ref;
    let batch = this.db.firestore.batch();
    batch.update(polyRef, stubPolygon);
    batch.update(polyRef, polygon);
    return batch.commit();
    // return this.getPolygonById(polygon.id).update(polygon);
  }

  setActivePolygon(polygon) {
    return this.getPolygonById('active').set(polygon);
  }

  deletePolygon(id: string) {
    return this.getPolygonById(id).delete();
  }
}
