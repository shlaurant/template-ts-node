export type EventString = string

export type Event<T extends object> = T & {
  events: ReadonlyArray<EventString>
}

export function isEvent<T extends object>(data: T): data is Event<T> {
  return "events" in data && typeof data.events === "object"
}
