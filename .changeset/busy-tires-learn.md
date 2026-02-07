---
"embla-carousel-angular": major
---

Migrate the Angular wrapper to Embla Carousel `v9.0.0`.

Breaking changes:
- Rename wrapper methods `scrollTo`, `scrollPrev`, `scrollNext` to `goTo`, `goToPrev`, `goToNext`.
- Align event names with Embla v9 lowercase event model and remove `init` usage.
- Move `embla-carousel` to `peerDependencies`.
