import { Id, Identifiable } from "./id"

export type Ship = Readonly<{
  combat: number
  upkeep: number
}>

export type ShipAssignment = Readonly<{
  assignedAt: number
  shipIds: ReadonlyArray<Id>
}>

export function assignShips<T extends object>(
  turn: number,
  obj: T,
  ships: ReadonlyArray<Identifiable<Ship>>,
): T & ShipAssignment {
  return {
    ...obj,
    assignedAt: turn,
    shipIds: ships.map((e) => e.id),
  }
}

export function dismissShips<T extends object>(obj: T & ShipAssignment): T {
  const ret: any = { ...obj }
  delete ret.assignedAt
  delete ret.shipIds
  return ret
}

export function isShipAssigned<T extends object>(obj: T): obj is T & ShipAssignment {
  return "assignedAt" in obj && "shipIds" in obj
}
