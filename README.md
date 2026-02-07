<p align="center">
  <a href="https://www.embla-carousel.com/"><img width="100" height="100" src="https://www.embla-carousel.com/embla-logo.svg" alt="Embla Carousel">
  </a>
  <a href="https://angular.dev/"><img width="100" height="100" src="/src/assets/images/logos/angular_renaissance.png" alt="Angular">
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/embla-carousel-angular" target="__blank"><img src="https://img.shields.io/npm/v/embla-carousel-angular" alt="NPM version" /></a>
  <a href="https://bundlephobia.com/package/embla-carousel-angular" target="__blank"><img src="https://badgen.net/bundlephobia/minzip/embla-carousel-angular" alt="Bundlephobia minzip" /></a>
  <a href="https://www.npmjs.com/package/embla-carousel-angular" target="__blank"><img src="https://img.shields.io/npm/dm/embla-carousel-angular" alt="NPM downloads" /></a>
</p>

<h2 align="center">Embla Carousel Angular</h2>

<p align="center">
  An Angular wrapper for <strong>Embla Carousel</strong>.
</p>

<br>

<h2 align="center">Installation</h2>

```shell
npm i embla-carousel embla-carousel-angular
```

<br>

<h2 align="center">Breaking changes in Embla v9</h2>

- `scrollTo`, `scrollPrev`, `scrollNext` were renamed to `goTo`, `goToPrev`, `goToNext`.
- `EmblaEventType` values are now lowercase (`pointerdown`, `slidesinview`, `reinit`, ...).
- `init` event is removed.

<br>


<h2 align="center">The component structure</h2>

Embla Carousel provides the handy `EmblaCarouselDirective` **standalone** directive for seamless integration with Angular. A minimal setup requires an **overflow wrapper** and a **scroll container**. Start by adding the following structure to your carousel:

```ts
import { Component, effect, viewChild } from '@angular/core'
import {
  EmblaCarouselDirective,
  EmblaCarouselType
} from 'embla-carousel-angular'

@Component({
  selector: 'app-carousel',
  template: `
    <div class="embla" emblaCarousel [options]="options">
      <div class="embla__container">
        <div class="embla__slide">Slide 1</div>
        <div class="embla__slide">Slide 2</div>
        <div class="embla__slide">Slide 3</div>
      </div>
    </div>
  `,
  imports: [EmblaCarouselDirective],
  standalone: true
})
export class CarouselComponent implements AfterViewInit {
  private emblaRef = viewChild<EmblaCarouselDirective>(EmblaCarouselDirective);

  private emblaApi?: EmblaCarouselType
  private options = { loop: false }

  constructor() {
    effect(() => {
      this.emblaApi = this.emblaRef()?.emblaApi;
    });
  }
}
```

<h2 align="center">Styling the carousel</h2>

The element with the classname `embla` is needed to cover the scroll overflow. Its child element with the `container` classname is the scroll body that scrolls the slides. Continue by adding the following **CSS** to these elements:

```css
.embla {
  overflow: hidden;
}
.embla__container {
  display: flex;
}
.embla__slide {
  flex: 0 0 100%;
  min-width: 0;
}
```

<h2 align="center">Accessing the carousel API</h2>

The `emblaCarousel` directive takes the Embla Carousel [options](https://www.embla-carousel.com/api/options/) as part of its inputs. Additionally, you can access the [API](https://www.embla-carousel.com/api/) by using the `viewChild` signal to access the carousel in the effect.

> [!WARNING]
>  Calling the following embla APIs directly will trigger too much ChangeDetection, which will lead to serious performance issues.

<br />

- `emblaApi.on()`
- `emblaApi.goToNext()`
- `emblaApi.goToPrev()`
- `emblaApi.goTo()`

Consider using the following methods which are wrapped with `ngZone.runOutsideAngular()`:

- `EmblaCarouselDirective.goToPrev()`
- `EmblaCarouselDirective.goToNext()`
- `EmblaCarouselDirective.goTo()`

```ts
import { Component, effect, viewChild } from '@angular/core'
import {
  EmblaCarouselDirective,
  EmblaCarouselType
} from 'embla-carousel-angular'

@Component({
  selector: 'app-carousel',
  template: `
    <div class="embla" emblaCarousel [options]="options">
      <div class="embla__container">
        <div class="embla__slide">Slide 1</div>
        <div class="embla__slide">Slide 2</div>
        <div class="embla__slide">Slide 3</div>
      </div>
    </div>
  `,
  imports: [EmblaCarouselDirective],
  standalone: true
})
export class CarouselComponent {
  private emblaRef = viewChild<EmblaCarouselDirective>(EmblaCarouselDirective);

  private emblaApi?: EmblaCarouselType
  private options = { loop: false }

  constructor() {
    effect(() => {
      this.emblaApi = this.emblaRef()?.emblaApi;
    });
  }
}
```

<h2 align="center">Listening the carousel events</h2>

The `emblaCarousel` directive also provides a custom event: `emblaChange` that forwards embla events, also wrapped in `ngZone.runOutsideAngular`. You need to listen by passing the specified event names into `subscribeToEvents` input on demand.

```ts
import { Component, effect, viewChild } from '@angular/core'
import {
  EmblaCarouselDirective,
  EmblaCarouselType,
  EmblaEventType
} from 'embla-carousel-angular'

@Component({
  selector: 'app-carousel',
  template: `
    <div
      class="embla"
      emblaCarousel
      [options]="options"
      [subscribeToEvents]="subscribeToEvents"
      (emblaChange)="onEmblaChange($event)"
    >
      <div class="embla__container">
        <div class="embla__slide">Slide 1</div>
        <div class="embla__slide">Slide 2</div>
        <div class="embla__slide">Slide 3</div>
      </div>
    </div>
  `,
  imports: [EmblaCarouselDirective],
  standalone: true
})
export class CarouselComponent {
  private emblaRef = viewChild<EmblaCarouselDirective>(EmblaCarouselDirective);

  private emblaApi?: EmblaCarouselType
  private options = { loop: false }

  constructor() {
    effect(() => {
      this.emblaApi = this.emblaRef()?.emblaApi;
    });
  }

  public readonly subscribeToEvents: EmblaEventType[] = [
    'pointerdown',
    'pointerup',
    'slideschanged',
    'slidesinview',
    'select',
    'settle',
    'destroy',
    'reinit',
    'resize',
    'scroll'
  ]

  onEmblaChange(event: EmblaEventType): void {
    console.log(`Embla event triggered: ${event}`)
  }
}
```

<h2 align="center">SSR guidance</h2>

When using Angular Universal / SSR:

- The directive only creates Embla in the browser, so `emblaApi` is `undefined` on the server.
- Guard API calls with optional chaining or browser-only effects.
- Use Embla v9 `options.ssr` to pre-compute snap positions for better first paint stability.
- After client init, `emblaApi?.ssrStyles(containerSelector, slideSelector)` can be used to generate inline styles for SSR/hydration workflows if you need deterministic server/client layout.

<h2 align="center">Adding plugins</h2>

Start by installing the plugin you want to use. In this example, we're going to install the [Autoplay](https://www.embla-carousel.com/plugins/autoplay/) plugin:

```shell
npm install embla-carousel-autoplay --save
```

The `emblaCarousel` directive inputs also accepts [plugins](https://www.embla-carousel.com/plugins/). Note that plugins need to be passed in an array like so:

```ts
import { Component, effect, viewChild } from '@angular/core'
import {
  EmblaCarouselDirective,
  EmblaCarouselType
} from 'embla-carousel-angular'
import Autoplay from 'embla-carousel-autoplay'

@Component({
  selector: 'app-carousel',
  template: `
    <div class="embla" emblaCarousel [options]="options" [plugins]="plugins">
      <div class="embla__container">
        <div class="embla__slide">Slide 1</div>
        <div class="embla__slide">Slide 2</div>
        <div class="embla__slide">Slide 3</div>
      </div>
    </div>
  `,
  imports: [EmblaCarouselDirective],
  standalone: true
})
export class CarouselComponent {
  private emblaRef = viewChild<EmblaCarouselDirective>(EmblaCarouselDirective);

  private emblaApi?: EmblaCarouselType
  public options = { loop: false }
  public plugins = [Autoplay()]

  constructor() {
    effect(() => {
      this.emblaApi = this.emblaRef()?.emblaApi;
    });
  }
}
```

<div align="center">
  <strong>
    <h2 align="center">Thanks</h2>
  </strong>
  <p align="center">
     Thanks to <a href="https://github.com/davidjerleke">davidjerleke</a>, <a href="https://github.com/zip-fa">zip-fa</a> and <a href="https://github.com/JeanMeche">JeanMeche</a> for the review and advice.
  </p>
</div>
