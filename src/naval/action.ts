import { Data } from "./data"
import * as c from "./core"
import { none, Option, some } from "fp-ts/Option"
import { Ship } from "./ship"

export function nextTurn(data: Data): Data {
  return { ...data, turn: data.turn + 1 }
}

export function signContract(data: Data, com: c.Company, cont: c.Contract): Data {
  return { ...data, playerCompany: c.signContract(com, cont, data.turn) }
}

export function createFleet(data: Data, com: c.Company, ships: ReadonlyArray<Ship>): Data {
  return { ...data, playerCompany: c.createFleet(com, ships) }
}

export function assignFleet(data: Data, com: c.Company, cont: c.Contract, fleet: c.Fleet): Option<Data> {
  const newCom = c.assignFleet(com, cont, fleet, data.turn)
  if (newCom._tag === "Some") {
    return some({ ...data, playerCompany: newCom.value })
  } else {
    return none
  }
}
