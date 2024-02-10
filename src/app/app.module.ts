import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { CarouselComponent } from './components/carousel/carousel.component'

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CarouselComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
