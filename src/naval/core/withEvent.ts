export type EventString = string

export type WithEvent<T extends object> = T & {
  events: ReadonlyArray<EventString>
}

export function isWithEvent<T extends object>(data: T): data is WithEvent<T> {
  return "events" in data && typeof data.events === "object"
}
