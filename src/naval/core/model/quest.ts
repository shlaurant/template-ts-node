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

export type EnemyInformation<T extends object> = Readonly<{
  possibleEnemies: ReadonlyArray<T>
  minEnemies: number
  maxEnemies: number
}>

export type QuestWithEnemyInformation<T extends object> = Quest & EnemyInformation<T>

export function addPossibleEnemies<T extends object>(
  quest: Quest,
  info: EnemyInformation<T>,
): Quest & EnemyInformation<T> {
  return {
    ...quest,
    ...info,
  }
}
