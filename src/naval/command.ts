import { Identifiable } from "./core/id"
import { assignQuest, Quest, QuestAssignment } from "./core/quest"
import { assignShips, Ship, ShipAssignment } from "./core/ship"

export type DispatchShipsInput = {
  turn: number
  quest: Identifiable<Quest>
  ships: ReadonlyArray<Identifiable<Ship>>
}

export type DispatchShipsReturn = {
  quest: Identifiable<Quest & ShipAssignment>
  ships: ReadonlyArray<Identifiable<Ship & QuestAssignment>>
}

export function dispatchShips(input: DispatchShipsInput): DispatchShipsReturn {
  return {
    quest: assignShips(input.turn, input.quest, input.ships),
    ships: input.ships.map((e) => assignQuest(e, input.quest)),
  }
}
