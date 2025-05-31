import { Id, Identifiable } from "./id"
import { dismissQuest, Quest, QuestAssignment } from "./quest"
import { dismissShips, Ship, ShipAssignment } from "./ship"

export type UpdateDispatchResult = {
  quests: ReadonlyMap<Id, Identifiable<Quest>>
  ships: ReadonlyMap<Id, Identifiable<Ship>>
  rewards: number
  events: string[]
}

export function updateDispatchStatus(
  turn: number,
  quests: ReadonlyMap<Id, Identifiable<Quest & ShipAssignment>>,
  ships: ReadonlyMap<Id, Identifiable<Ship & QuestAssignment>>,
): UpdateDispatchResult {
  const ret = {
    quests: new Map<Id, Identifiable<Quest>>(),
    ships: new Map<Id, Identifiable<Ship>>(),
    rewards: 0,
    events: [] as string[],
  }

  const toDismiss = new Set<Id>()

  quests.forEach((v, k) => {
    if (v.assignedAt + v.length < turn) {
      ret.quests.set(k, dismissShips(v))
      ret.rewards += v.reward
      v.shipIds.forEach(e=>toDismiss.add(e))
      ret.events.push(`Quest ${k} has been completed`)
    }
  })

  ships.forEach((v, k) => {
    if (toDismiss.has(k)) {
      ret.ships.set(k, dismissQuest(v))
    } else {
      ret.ships.set(k, v)
    }
  })

  return ret
}
