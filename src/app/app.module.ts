import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NguiMapModule } from '@ngui/map';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';


import { AppComponent } from './app.component';


import { environment } from '../environments/environment';
import { MapService } from './services/map.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NguiMapModule.forRoot({ apiUrl: `https://maps.google.com/maps/api/js?key=${environment.googleMapsKey}&libraries=drawing` }),
    AngularFireModule.initializeApp(environment.firebaseConfig, 'bim-earth'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  providers: [MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
