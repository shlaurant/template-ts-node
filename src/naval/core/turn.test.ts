import { Identifiable } from "./id"
import { Quest, QuestAssignment } from "./quest"
import { Ship, ShipAssignment } from "./ship"
import { updateDispatchStatus } from "./turn"

test("updateDispatchStatus", () => {
  const turn = 2
  const quests: ReadonlyArray<Identifiable<Quest & ShipAssignment>> = [
    { assignedAt: 0, difficulty: 0, id: 0, length: 1, reward: 1, shipIds: [1] },
  ]
  const ships: ReadonlyArray<Identifiable<Ship & QuestAssignment>> = [
    { combat: 0, id: 1, questId: 0, upkeep: 0 },
  ]

  const ret = updateDispatchStatus(turn, quests, ships)

  expect(ret.quests).toEqual([{ difficulty: 0, id: 0, length: 1, reward: 1 }])
  expect(ret.ships).toEqual([{ combat: 0, id: 1, upkeep: 0 }])
  expect(ret.rewards).toBe(1)
  expect(ret.events).toHaveLength(1)
})
