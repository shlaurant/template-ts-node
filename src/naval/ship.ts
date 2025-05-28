import { Id, Identifiable } from "./id"

export type Ship = Readonly<{
  combat: number,
  upkeep: number
}>

export type ShipAssignment = Readonly<{
  assignedAt: number
  shipIds: ReadonlyArray<Id>
}>

export function assignShips<T extends object>(turn: number, obj: T, ships: ReadonlyArray<Identifiable<T>>): T & ShipAssignment {
  return {
    ...obj,
    assignedAt: turn,
    shipIds: ships.map(e => e.id)
  }
}