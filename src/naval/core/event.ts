export type EventString = string

export type Event<T extends object> = T & {
  event: EventString
}

export function isEvent<T extends object>(data: T): data is Event<T> {
  return "event" in data && typeof data.event === "string"
}
