import { Id, Identifiable } from "./id"

export type Quest = Readonly<{
  difficulty: number
  length: number
  reward: number
}>

export type ShipAssignment = Readonly<{
  assignedAt: number
  shipIds: ReadonlyArray<Id>
}>

export function AssignShipsToQuest<T extends object>(turn: number, quest: Quest, ships: ReadonlyArray<Identifiable<T>>): Quest & ShipAssignment {
  return {
    ...quest,
    assignedAt: turn,
    shipIds: ships.map(e => e.id)
  }
}

export const Quests: Quest[] = [
  { difficulty: 1, length: 1, reward: 1 },
  { difficulty: 2, length: 1, reward: 2 },
  { difficulty: 1, length: 2, reward: 2 },
  { difficulty: 3, length: 1, reward: 3 },
  { difficulty: 1, length: 3, reward: 3 },
  { difficulty: 4, length: 1, reward: 4 },
  { difficulty: 2, length: 2, reward: 4 },
  { difficulty: 1, length: 4, reward: 4 }
]