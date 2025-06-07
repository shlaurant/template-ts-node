import { Id, Identifiable } from "../id"

export type Quest = Readonly<{
  length: number
  reward: number
}>

export type QuestAssignment = Readonly<{
  questId: Id
}>

export function assignQuest<T extends object>(
  obj: T,
  quest: Identifiable<Quest>,
): T & QuestAssignment {
  return {
    ...obj,
    questId: quest.id,
  }
}

export function dismissQuest<T extends object>(obj: T & QuestAssignment): T {
  const ret: any = { ...obj }
  delete ret.questId
  return ret
}

export function isQuestAssigned<T extends object>(obj: T): obj is T & QuestAssignment {
  return "questId" in obj
}

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
