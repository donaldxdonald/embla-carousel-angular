/*
 * Public API Surface of embla-carousel-angular
 */

export type {
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType,
  EmblaPluginType,
  EmblaEventListType,
  EmblaPluginsType,
  EngineType,
  ScrollBodyType,
  CreatePluginType,
  CreateOptionsType,
  OptionsHandlerType,
} from 'embla-carousel'
export { EmblaCarouselDirective } from './lib/embla-carousel.directive'
export { EMBLA_OPTIONS_TOKEN, provideEmblaGlobalOptions } from './lib/utils'
