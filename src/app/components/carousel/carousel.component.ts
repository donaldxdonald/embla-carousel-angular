import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  viewChild,
} from '@angular/core'
import {
  EmblaCarouselDirective,
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType,
} from 'embla-carousel-angular'

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  imports: [CommonModule, EmblaCarouselDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent {
  emblaRef = viewChild(EmblaCarouselDirective)

  options = input<EmblaOptionsType>({})
  slides = input<number[]>([])

  prevBtnEnabled = signal(false)
  nextBtnEnabled = signal(false)
  selectedIndex = signal(0)
  scrollSnaps = signal<number[]>([])
  subscribeToEvents: EmblaEventType[] = ['init', 'reInit', 'select', 'scroll']

  imageByIndex(index: number) {
    return `/assets/images/slide-${index}.jpg`
  }

  scrollPrev() {
    this.emblaRef()?.scrollPrev()
  }

  scrollNext() {
    this.emblaRef()?.scrollNext()
  }

  scrollTo(index: number) {
    this.emblaRef()?.scrollTo(index)
  }

  onEmblaChange(type: EmblaEventType, emblaApi: EmblaCarouselType) {
    if (type === 'init') {
      this.scrollSnaps.set(emblaApi.scrollSnapList())
    }

    if (type === 'select' || type === 'init' || type === 'reInit') {
      this.selectedIndex.set(emblaApi.selectedScrollSnap())
      this.prevBtnEnabled.set(emblaApi.canScrollPrev())
      this.nextBtnEnabled.set(emblaApi.canScrollNext())
      return
    }
  }
}
