import { Id, Identifiable } from "./id"

export type Ship = Readonly<{
  combat: number,
  upkeep: number
}>

export type QuestAssignment = Readonly<{
  questId: Id
}>

function assignToQuest<T extends object>(ship: Ship, quest: Identifiable<T>): Ship & QuestAssignment {
  return {
    ...ship,
    questId: quest.id
  }
}
