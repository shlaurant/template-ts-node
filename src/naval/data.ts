import { Id, Identifiable } from "./id"
import { Ship } from "./ship"
import { Quest } from "./quest"

export type Data = {
  turn: number
  isOver: boolean
  overReason?: string
  balance: number
  ships: Map<Id, Identifiable<Ship>>
  quests: Map<Id, Identifiable<Quest>>
}