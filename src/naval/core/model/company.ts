import { Ship } from "./ship"
import { Id, Identifiable } from "../id"
import * as f from "fp-ts/function"
import * as ra from "fp-ts/ReadonlyArray"

export type Company = Readonly<{
  balance: number
  ships: ReadonlyMap<Id, Identifiable<Ship>>
}>

export function upkeep(c: Company) {
  return f.pipe(
    Array.from(c.ships.values()),
    ra.reduce(0, (ret, ship) => ret + ship.upkeep),
  )
}
