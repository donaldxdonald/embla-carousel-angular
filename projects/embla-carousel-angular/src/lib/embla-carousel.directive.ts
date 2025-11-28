import {
  DestroyRef,
  Directive,
  ElementRef,
  InputSignal,
  NgZone,
  afterNextRender,
  effect,
  inject,
  input,
  output,
} from '@angular/core'
import EmblaCarousel, {
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType,
  EmblaPluginType,
} from 'embla-carousel'
import {
  areOptionsEqual,
  arePluginsEqual,
  canUseDOM,
} from 'embla-carousel-reactive-utils'
import { Subject } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { EMBLA_OPTIONS_TOKEN, throttleDistinct } from './utils'

@Directive({
  selector: '[emblaCarousel]',
  exportAs: 'emblaCarousel',
})
export class EmblaCarouselDirective {
  protected _globalOptions: EmblaOptionsType | undefined = inject(EMBLA_OPTIONS_TOKEN)
  protected _ngZone = inject(NgZone)
  protected _elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  protected _destroyRef = inject(DestroyRef)

  options: InputSignal<EmblaOptionsType> = input<EmblaOptionsType>({})
  plugins: InputSignal<EmblaPluginType[]> = input<EmblaPluginType[]>([])
  subscribeToEvents = input<EmblaEventType[]>([])
  eventsThrottleTime = input(100)

  readonly emblaChange = output<EmblaEventType>()

  private storedOptions = this.options()
  private storedPlugins = this.plugins()
  emblaApi?: EmblaCarouselType

  constructor() {
    if (this._globalOptions) {
      EmblaCarousel.globalOptions = this._globalOptions
    }

    // Init Embla Carousel
    afterNextRender({
      write: () => {
        if (!canUseDOM()) return
        this._ngZone.runOutsideAngular(() => {
          this.emblaApi = EmblaCarousel(this._elementRef.nativeElement, this.storedOptions, this.storedPlugins)
          this.listenEvents()
        })
      },
    })

    // Watch input changes
    effect(() => {
      const plugins = this.plugins()
      const options = this.options()
      let shouldReInit = false

      if (options && !areOptionsEqual(this.storedOptions, options)) {
        this.storedOptions = options
        shouldReInit = true
      }

      if (plugins && !arePluginsEqual(this.storedPlugins, plugins)) {
        this.storedPlugins = plugins
        shouldReInit = true
      }

      if (shouldReInit) {
        this.reInit()
      }
    })

    // Cleanup Embla Carousel
    this._destroyRef.onDestroy(() => {
      this.emblaApi?.destroy()
    })
  }

  scrollTo(...args: Parameters<EmblaCarouselType['scrollTo']>): void {
    this._ngZone.runOutsideAngular(() => this.emblaApi?.scrollTo(...args))
  }

  scrollPrev(...args: Parameters<EmblaCarouselType['scrollPrev']>): void {
    this._ngZone.runOutsideAngular(() => this.emblaApi?.scrollPrev(...args))
  }

  scrollNext(...args: Parameters<EmblaCarouselType['scrollNext']>): void {
    this._ngZone.runOutsideAngular(() => this.emblaApi?.scrollNext(...args))
  }

  reInit() {
    if (!this.emblaApi) {
      return
    }

    this._ngZone.runOutsideAngular(() => {
      this.emblaApi?.reInit(this.storedOptions, this.storedPlugins)
    })
  }

  /**
   * `eventsThrottler$` Subject was made just because `scroll` event fires too often.
   */
  private listenEvents(): void {
    if (this.subscribeToEvents().length === 0) {
      return
    }

    const eventsThrottler$ = new Subject<EmblaEventType>()

    eventsThrottler$
      .pipe(
        throttleDistinct(this.eventsThrottleTime()),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(eventName => {
        this._ngZone.run(() => this.emblaChange.emit(eventName))
      })

    this._ngZone.runOutsideAngular(() => {
      this.subscribeToEvents().forEach(eventName => {
        this.emblaApi!.on(eventName, () => eventsThrottler$.next(eventName))
      })
    })
  }
}
