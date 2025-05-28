import { none, Option, some } from "fp-ts/Option"

export function getRandomElement<T>(slice: ReadonlyArray<T>): Option<T> {
  if (slice.length === 0) {
    return none
  }
  return some(slice[Math.floor(Math.random() * slice.length)])
}