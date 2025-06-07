import { Identifiable } from "../id"
import { Quest, QuestAssignment } from "../model/quest"
import { Ship, ShipAssignment } from "../model/ship"
import { updateOnQuestShips } from "./quest"

test("updateDispatchStatus", () => {
  const turn = 2
  const quests: ReadonlyArray<Identifiable<Quest & ShipAssignment>> = [
    { assignedAt: 0, id: 0, length: 1, reward: 1, shipIds: [1] },
  ]
  const ships: ReadonlyArray<Identifiable<Ship & QuestAssignment>> = [
    { id: 1, questId: 0, upkeep: 0 },
  ]

  const ret = updateOnQuestShips(turn, quests, ships)

  expect(ret.quests).toEqual([{ id: 0, length: 1, reward: 1 }])
  expect(ret.ships).toEqual([{ id: 1, upkeep: 0 }])
  expect(ret.rewards).toBe(1)
  expect(ret.events).toHaveLength(1)
})
