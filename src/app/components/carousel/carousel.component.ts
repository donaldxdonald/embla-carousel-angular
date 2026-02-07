import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
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
  emblaApi = computed(() => this.emblaRef()?.emblaApiSignal())
  scrollSnaps = computed(() => this.emblaApi()?.snapList())
  subscribeToEvents: EmblaEventType[] = ['reinit', 'select', 'scroll']

  constructor() {
    effect(() => {
      const embla = this.emblaApi()
      if (embla) {
        this.onEmblaChange('reinit', embla)
      }
    })
  }

  imageByIndex(index: number) {
    return `/assets/images/slide-${index}.jpg`
  }

  goToPrev() {
    this.emblaRef()?.goToPrev()
  }

  goToNext() {
    this.emblaRef()?.goToNext()
  }

  goTo(index: number) {
    this.emblaRef()?.goTo(index)
  }

  onEmblaChange(type: EmblaEventType, emblaApi: EmblaCarouselType) {
    if (type === 'select' || type === 'reinit') {
      this.selectedIndex.set(emblaApi.selectedSnap())
      this.prevBtnEnabled.set(emblaApi.canGoToPrev())
      this.nextBtnEnabled.set(emblaApi.canGoToNext())
      return
    }
  }
}
