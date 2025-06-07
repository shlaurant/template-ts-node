import { Quest } from "../core/model/quest"
import { getRandomElement } from "../../random/slice"

export const Quests: Quest[] = [
  { length: 1, reward: 1 },
  { length: 1, reward: 2 },
  { length: 2, reward: 2 },
  { length: 1, reward: 3 },
  { length: 3, reward: 3 },
  { length: 1, reward: 4 },
  { length: 2, reward: 4 },
  { length: 4, reward: 4 },
]

export function getRandomQuest(): Quest {
  const ret = getRandomElement(Quests)
  if (ret._tag === "None") {
    throw new Error("quest is none")
  }

  return ret.value
}