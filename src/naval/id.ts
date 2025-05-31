
export type Id = number

export type Identifiable<T extends object> = T & {
  id: Id
}

export function id(src: unknown): Id {
  let ret: Id | undefined;

  if(typeof src === 'string') {
    try {
      src = Number(src)
    } catch {
      throw new Error(`invalid id: ${src}`)
    }
  }

  if(typeof src === 'number' && Number.isInteger(src)) {
    ret = src
  }

  if(ret === undefined) {
    throw new Error(`invalid id: ${src}`)
  }

  return ret
}

let nextId = 1

export function giveId<T extends object>(obj: T): Identifiable<T> {
  return {
    ...obj,
    id: nextId++
  }
}