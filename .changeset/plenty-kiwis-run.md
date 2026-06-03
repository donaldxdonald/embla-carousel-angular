---
"embla-carousel-angular": major
---

Update to Angular v22.

Breaking changes:
- Move `embla-carousel` and `embla-carousel-reactive-utils` to `peerDependencies`.
- Need to import `EmblaCarouselType` from `embla-carousel` instead of `embla-carousel-angular`.

Features:
- Add wrapper methods `goTo`, `goToPrev`, `goToNext` for the future Embla Carousel v9.
