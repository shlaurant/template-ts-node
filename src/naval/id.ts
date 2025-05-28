export type Id = number

export type Identifiable<T extends object> = T & {
  id: Id
}

export function giveId<T extends object>(obj: T): Identifiable<T> {
  return {
    ...obj,
    id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  }
}