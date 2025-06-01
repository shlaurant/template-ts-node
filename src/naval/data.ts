import { Id, Identifiable } from "./core/id"
import { Ship } from "./core/ship"
import { Quest } from "./core/quest"
import { DispatchShipsReturn } from "./core/command"

export type Data = {
  turn: number
  isOver: boolean
  overReason?: string
  balance: number
  ships: Map<Id, Identifiable<Ship>>
  quests: Map<Id, Identifiable<Quest>>
}

export function UpdateDispatchShipsReturn(data: Data, value: DispatchShipsReturn) {
  data.quests.set(value.quest.id, value.quest)
  value.ships.forEach((e) => data.ships.set(e.id, e))
}
