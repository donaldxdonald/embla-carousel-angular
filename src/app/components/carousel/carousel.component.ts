import { CommonModule } from '@angular/common'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
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
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent implements AfterViewInit {
  @ViewChild(EmblaCarouselDirective, { static: false })
    emblaRef!: EmblaCarouselDirective

  @Input() options: EmblaOptionsType = {}
  @Input() slides: number[] = []

  prevBtnEnabled = false
  nextBtnEnabled = false
  selectedIndex = 0
  scrollSnaps: number[] = []
  subscribeToEvents: EmblaEventType[] = ['init', 'reInit', 'select']

  ngAfterViewInit(): void {
    const { emblaApi } = this.emblaRef
    if (emblaApi) {
      this.scrollSnaps = emblaApi.scrollSnapList()
    }
  }

  imageByIndex(index: number) {
    return `/assets/images/slide-${index}.jpg`
  }

  scrollPrev() {
    this.emblaRef.scrollPrev()
  }

  scrollNext() {
    this.emblaRef.scrollNext()
  }

  scrollTo(index: number) {
    this.emblaRef.scrollTo(index)
  }

  onSelect(emblaApi: EmblaCarouselType) {
    this.selectedIndex = emblaApi.selectedScrollSnap()
    this.prevBtnEnabled = emblaApi.canScrollPrev()
    this.nextBtnEnabled = emblaApi.canScrollNext()
  }
}
