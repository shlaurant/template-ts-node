import { Identifiable } from "./id"
import { assignQuest, Quest, QuestAssignment } from "./quest"
import { assignShips, Ship, ShipAssignment } from "./ship"

export type DispatchShipsReturn = {
  quest: Identifiable<Quest & ShipAssignment>,
  ships: ReadonlyArray<Identifiable<Ship & QuestAssignment>>
}

export function dispatchShips(
  turn: number,
  quest: Identifiable<Quest>,
  ships: ReadonlyArray<Identifiable<Ship>>
): DispatchShipsReturn {
  return {
    quest: assignShips(turn, quest, ships),
    ships: ships.map(e => assignQuest(e, quest))
  }
}