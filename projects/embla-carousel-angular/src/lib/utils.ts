import { InjectionToken, Provider } from '@angular/core'
import { EmblaOptionsType } from 'embla-carousel'
import { Observable, filter, map, scan } from 'rxjs'

export const EMBLA_OPTIONS_TOKEN: InjectionToken<EmblaOptionsType | undefined> = new InjectionToken<
EmblaOptionsType | undefined
>('embla global options', {
  factory: () => undefined,
})

export function canUseDOM(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

export function provideEmblaGlobalOptions(
  options?: EmblaOptionsType,
): Provider[] {
  return [
    {
      provide: EMBLA_OPTIONS_TOKEN,
      useValue: options,
    },
  ]
}

// Solution from https://stackoverflow.com/a/53627167
export function throttleDistinct<T>(
  duration: number,
  equals: (a: T, b: T) => boolean = (a, b) => a === b,
) {
  return (source: Observable<T>) => {
    return source
      .pipe(
        map(x => {
          return {
            value: x,
            time: Date.now(),
            keep: true,
          }
        }),
        scan((acc, curr) => {
          const diff = curr.time - acc.time

          const isSame = equals(curr.value, acc.value)
          return diff > duration || (diff < duration && !isSame)
            ? { ...curr, keep: true }
            : { ...acc, keep: false }
        }),
        filter(x => x.keep),
        map(x => x.value),
      )
  }
}
