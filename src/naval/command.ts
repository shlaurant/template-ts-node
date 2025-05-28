import { Identifiable } from "./id"
import { Quest, ShipAssignment } from "./quest"
import { QuestAssignment, Ship } from "./ship"

export type DispatchShipsReturn = {
  quest: Identifiable<Quest & ShipAssignment>,
  ships: Identifiable<Ship & QuestAssignment>
}

export function dispatchShips(turn: number, quest: Identifiable<Quest>, ships: ReadonlyArray<Identifiable<Ship>>) {

}