import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NguiMapModule } from '@ngui/map';

import { AppComponent } from './app.component';


import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NguiMapModule.forRoot({ apiUrl: `https://maps.google.com/maps/api/js?key=${environment.googleMapsKey}&libraries=drawing` })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
