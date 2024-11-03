import { Component } from '@angular/core'
import { EmblaOptionsType } from 'embla-carousel-angular'
import { CarouselComponent } from './components/carousel/carousel.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CarouselComponent,
  ],
})
export class AppComponent {
  OPTIONS: EmblaOptionsType = {}
  SLIDES = Array.from({ length: 4 }, (_, i) => i)
}
