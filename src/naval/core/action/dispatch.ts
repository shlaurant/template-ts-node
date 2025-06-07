import { Identifiable } from "../id"
import { assignQuest, Quest, QuestAssignment } from "../model/quest"
import { assignShips, Ship, ShipAssignment } from "../model/ship"
import { WithEvent } from "../withEvent"

export type DispatchShipsInput = {
  turn: number
  quest: Identifiable<Quest>
  ships: ReadonlyArray<Identifiable<Ship>>
}

export type DispatchShipsReturn = {
  quest: Identifiable<Quest & ShipAssignment>
  ships: ReadonlyArray<Identifiable<Ship & QuestAssignment>>
}

export function dispatchShips(input: DispatchShipsInput): WithEvent<DispatchShipsReturn> {
  return {
    quest: assignShips(input.turn, input.quest, input.ships),
    ships: input.ships.map((e) => assignQuest(e, input.quest)),
    events: [
      `dispatched ships ${JSON.stringify(input.ships.map((e) => e.id))} to quest ${input.quest.id}`,
    ],
  }
}
