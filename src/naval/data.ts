import * as f from "fp-ts/function"
import { Id, Identifiable } from "./core/id"
import { Ship } from "./core/ship"
import { Quest } from "./core/quest"
import { DispatchShipsReturn } from "./core/command"
import { UpdateDispatchResult } from "./core/turn"
import { EventString, isEvent } from "./core/event"

export type Data = {
  turn: number
  isOver: boolean
  overReason?: string
  balance: number
  ships: Map<Id, Identifiable<Ship>>
  quests: Map<Id, Identifiable<Quest>>
  events: EventString[]
}

export function updateDispatchShipsReturn(data: Data, value: DispatchShipsReturn): Data {
  data.quests.set(value.quest.id, value.quest)
  value.ships.forEach((e) => data.ships.set(e.id, e))
  handleEvent(data, value)
  return data
}

export function updateCheckDispatchReturn(data: Data, value: UpdateDispatchResult): Data {
  value.quests.forEach((e) => data.quests.set(e.id, e))
  value.ships.forEach((e) => data.ships.set(e.id, e))
  data.balance += value.rewards
  handleEvent(data, value)
  return data
}

function handleEvent<T extends object>(data:Data, value: T) {
  if(isEvent(data)) {
    data.events.push(data.event)
  }
}