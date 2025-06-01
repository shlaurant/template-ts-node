import { Id, Identifiable } from "./core/id"
import { Ship } from "./core/ship"
import { Quest } from "./core/quest"

export type Data = {
  turn: number
  isOver: boolean
  overReason?: string
  balance: number
  ships: Map<Id, Identifiable<Ship>>
  quests: Map<Id, Identifiable<Quest>>
}