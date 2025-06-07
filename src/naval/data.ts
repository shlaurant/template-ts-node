import { Id, Identifiable } from "./core/id"
import { Ship } from "./core/model/ship"
import { QuestWithEnemyInformation } from "./core/model/quest"
import { DispatchShipsResult } from "./core/action/dispatch"
import { UpdateDispatchResult } from "./core/system/turn"
import { EventString, isWithEvent } from "./core/withEvent"
import { Combatant } from "./core/model/combat"
import assert from "node:assert"

export type Data = {
  turn: number
  isOver: boolean
  overReason?: string
  balance: number
  ships: Map<Id, Identifiable<Ship>>
  quests: Map<Id, Identifiable<QuestWithEnemyInformation<Combatant>>>
  events: EventString[]
}

export function updateDispatchShipsReturn(data: Data, value: DispatchShipsResult): Data {
  const quest = data.quests.get(value.quest.id)
  assert(quest !== undefined)
  data.quests.set(value.quest.id, { ...quest, ...value.quest })
  value.ships.forEach((e) => data.ships.set(e.id, e))
  handleEvent(data, value)
  return data
}

export function updateCheckDispatchReturn(data: Data, value: UpdateDispatchResult): Data {
  value.quests.forEach((e) => data.quests.delete(e.id))
  value.ships.forEach((e) => data.ships.set(e.id, e))
  data.balance += value.rewards
  handleEvent(data, value)
  return data
}

function handleEvent<T extends object>(data: Data, value: T) {
  if (isWithEvent(value)) {
    data.events.push(...value.events)
  }
}
