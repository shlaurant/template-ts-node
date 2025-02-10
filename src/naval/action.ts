import { Data } from "./data"
import * as c from "./core"

export function nextTurn(data: Data): Data {
  return { ...data, turn: data.turn + 1 }
}

export function signContract(data: Data, com: c.Company, cont: c.Contract): Data {
  return { ...data, playerCompany: c.signContract(com, cont) }
}

