import { Component } from '@angular/core'
import { EmblaOptionsType } from 'embla-carousel-angular'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  OPTIONS: EmblaOptionsType = {}
  SLIDES = Array.from({ length: 4 }, (_, i) => i)
}
