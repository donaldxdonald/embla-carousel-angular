import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  inject,
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
import { Subject, takeUntil, throttleTime } from 'rxjs'
import { EMBLA_OPTIONS_TOKEN } from './utils'

@Directive({
  selector: '[emblaCarousel]',
  exportAs: 'emblaCarousel',
  standalone: true,
})
export class EmblaCarouselDirective implements AfterViewInit, OnChanges, OnDestroy {
  private globalOptions = inject(EMBLA_OPTIONS_TOKEN)
  private ngZone = inject(NgZone)
  protected _elementRef = inject<ElementRef<HTMLElement>>(ElementRef)

  @Input() options: EmblaOptionsType = {}
  @Input() plugins: EmblaPluginType[] = []
  @Input() subscribeToEvents: EmblaEventType[] = []
  @Input() eventsThrottleTime = 100

  @Output() readonly emblaChange = new EventEmitter<EmblaEventType>()

  private destroy$ = new Subject<void>()
  private storedOptions = this.options
  private storedPlugins = this.plugins
  emblaApi?: EmblaCarouselType

  constructor() {
    if (this.globalOptions) {
      EmblaCarousel.globalOptions = this.globalOptions
    }
  }

  ngAfterViewInit(): void {
    if (!canUseDOM()) return
    this.ngZone.runOutsideAngular(() => {
      this.emblaApi = EmblaCarousel(
        this._elementRef.nativeElement,
        this.storedOptions,
        this.storedPlugins,
      )
    })
    this.listenEvents()
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { plugins, options } = changes

    if (options && !areOptionsEqual(this.storedOptions, options.currentValue)) {
      this.storedOptions = options.currentValue
      this.reInit()
    }

    if (plugins && !arePluginsEqual(this.storedPlugins, plugins.currentValue)) {
      this.storedPlugins = plugins.currentValue
      this.reInit()
    }
  }

  scrollTo(...args: Parameters<EmblaCarouselType['scrollTo']>): void {
    this.ngZone.runOutsideAngular(() => this.emblaApi?.scrollTo(...args))
  }

  scrollPrev(...args: Parameters<EmblaCarouselType['scrollPrev']>): void {
    this.ngZone.runOutsideAngular(() => this.emblaApi?.scrollPrev(...args))
  }

  scrollNext(...args: Parameters<EmblaCarouselType['scrollNext']>): void {
    this.ngZone.runOutsideAngular(() => this.emblaApi?.scrollNext(...args))
  }

  reInit() {
    if (!this.emblaApi) {
      return
    }

    this.ngZone.runOutsideAngular(() => {
      this.emblaApi?.reInit(this.storedOptions, this.storedPlugins)
    })
  }

  /**
   * `eventsThrottler$` Subject was made just because `scroll` event fires too often.
   */
  private listenEvents(): void {
    if (this.subscribeToEvents.length === 0) {
      return
    }

    const eventsThrottler$ = new Subject<EmblaEventType>()

    eventsThrottler$
      .pipe(throttleTime(this.eventsThrottleTime), takeUntil(this.destroy$))
      .subscribe(eventName => {
        this.ngZone.run(() => this.emblaChange.emit(eventName))
      })

    this.ngZone.runOutsideAngular(() => {
      this.subscribeToEvents.forEach(eventName => {
        this.emblaApi!.on(eventName, () => eventsThrottler$.next(eventName))
      })
    })
  }

  ngOnDestroy(): void {
    this.emblaApi?.destroy()
    this.destroy$.next()
    this.destroy$.complete()
  }
}
