import { Id, Identifiable } from "./id"
import { dismissQuest, Quest, QuestAssignment } from "./quest"
import { dismissShips, Ship, ShipAssignment } from "./ship"

export type UpdateDispatchResult = {
  quests: ReadonlyArray<Identifiable<Quest>>
  ships: ReadonlyArray<Identifiable<Ship>>
  rewards: number
  events: ReadonlyArray<string>
}

export function updateDispatchStatus(
  turn: number,
  quests: ReadonlyArray<Identifiable<Quest & ShipAssignment>>,
  ships: ReadonlyArray<Identifiable<Ship & QuestAssignment>>,
): UpdateDispatchResult {
  const ret = {
    quests: [] as Identifiable<Quest>[],
    ships: [] as Identifiable<Ship>[],
    rewards: 0,
    events: [] as string[],
  }

  const toDismiss = new Set<Id>()

  quests.forEach((e) => {
    if (e.assignedAt + e.length < turn) {
      ret.quests.push(dismissShips(e))
      ret.rewards += e.reward
      e.shipIds.forEach((id) => toDismiss.add(id))
      ret.events.push(`Quest ${e.id} has been completed`)
    }
  })

  ships.forEach((e) => {
    if (toDismiss.has(e.id)) {
      ret.ships.push(dismissQuest(e))
    }
  })

  return ret
}
