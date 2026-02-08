import {
  DestroyRef,
  Directive,
  ElementRef,
  InputSignal,
  NgZone,
  Signal,
  afterNextRender,
  effect,
  inject,
  input,
  output,
  signal,
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
} from 'embla-carousel-reactive-utils'
import { Subject } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { canUseDOM, EMBLA_OPTIONS_TOKEN, throttleDistinct } from './utils'

@Directive({
  selector: '[emblaCarousel]',
  exportAs: 'emblaCarousel',
})
export class EmblaCarouselDirective {
  protected _globalOptions: EmblaOptionsType | undefined = inject(EMBLA_OPTIONS_TOKEN)
  protected _ngZone = inject(NgZone)
  protected _elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  protected _destroyRef = inject(DestroyRef)

  readonly options: InputSignal<EmblaOptionsType> = input<EmblaOptionsType>({})
  readonly plugins: InputSignal<EmblaPluginType[]> = input<EmblaPluginType[]>([])
  readonly subscribeToEvents = input<EmblaEventType[]>([])
  readonly eventsThrottleTime = input(100)

  readonly emblaChange = output<EmblaEventType>()

  private storedOptions = this.options()
  private storedPlugins = this.plugins()
  private readonly _emblaApiSignal = signal<EmblaCarouselType | null>(null)
  readonly emblaApiSignal: Signal<EmblaCarouselType | null> = this._emblaApiSignal.asReadonly()

  get emblaApi() {
    return this.emblaApiSignal()
  }

  constructor() {
    if (this._globalOptions) {
      EmblaCarousel.globalOptions = this._globalOptions
    }

    // Init Embla Carousel
    afterNextRender({
      write: () => {
        if (!canUseDOM()) return
        this._ngZone.runOutsideAngular(() => {
          this._emblaApiSignal.set(EmblaCarousel(this._elementRef.nativeElement, this.storedOptions, this.storedPlugins))
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
      this._emblaApiSignal.set(null)
    })
  }

  goTo(...args: Parameters<EmblaCarouselType['goTo']>): void {
    this._ngZone.runOutsideAngular(() => this.emblaApi?.goTo(...args))
  }

  goToPrev(...args: Parameters<EmblaCarouselType['goToPrev']>): void {
    this._ngZone.runOutsideAngular(() => this.emblaApi?.goToPrev(...args))
  }

  goToNext(...args: Parameters<EmblaCarouselType['goToNext']>): void {
    this._ngZone.runOutsideAngular(() => this.emblaApi?.goToNext(...args))
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
