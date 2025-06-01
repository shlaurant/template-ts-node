import * as f from "fp-ts/function"
import { Id, Identifiable } from "./core/id"
import { Ship } from "./core/ship"
import { Quest } from "./core/quest"
import { DispatchShipsReturn } from "./core/command"
import { UpdateDispatchResult } from "./core/turn"

export type Data = {
  turn: number
  isOver: boolean
  overReason?: string
  balance: number
  ships: Map<Id, Identifiable<Ship>>
  quests: Map<Id, Identifiable<Quest>>
}

export function updateDispatchShipsReturn(data: Data, value: DispatchShipsReturn) {
  data.quests.set(value.quest.id, value.quest)
  value.ships.forEach((e) => data.ships.set(e.id, e))
}

export function updateDispatchStatusReturn(data: Data, value: UpdateDispatchResult) {
  value.quests.forEach((e) => data.quests.set(e.id, e))
  value.ships.forEach((e) => data.ships.set(e.id, e))
  data.balance += value.rewards
}
