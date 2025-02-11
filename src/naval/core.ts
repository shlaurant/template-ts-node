import { none, Option, some } from "fp-ts/Option"
import { deleteAt, findIndex } from "fp-ts/ReadonlyArray"
import { EqId, identify } from "./id"
import { Ship } from "./ship"

export type Contract = Readonly<{
  id: string
  duration: number
}>

export type Fleet = Readonly<{
  id: string
  ships: ReadonlyArray<Ship>
}>

export type ContractEntry = Readonly<{
  _tag: "un-assigned"
  contract: Contract
} | {
  _tag: "assigned"
  contract: Contract
  fleet: Fleet
  assignedAt: number
}>

export function isCompleted(turn: number, entry: ContractEntry): boolean {
  return entry._tag === "assigned" && turn - entry.assignedAt >= entry.contract.duration
}

export type Company = Readonly<{
  fleets: ReadonlyArray<Fleet>
  contracts: ReadonlyArray<ContractEntry>
}>

export function signContract(com: Company, cont: Contract, turn: number): Company {
  return { ...com, contracts: [...com.contracts, { _tag: "un-assigned", contract: cont }] }
}

export function createFleet(com: Company, ships: ReadonlyArray<Ship>): Company {
  return { ...com, fleets: [...com.fleets, identify({ id: "", ships: ships })] }
}

export function assignFleet(com: Company, cont: Contract, fleet: Fleet, turn: number): Option<Company> {
  const idx = findIndex<ContractEntry>((e) => EqId.equals(e.contract, cont))(com.contracts)

  if (idx._tag === "Some") {
    const ra = deleteAt(idx.value)(com.contracts)
    if (ra._tag === "None") {
      return none
    }

    const entry: ContractEntry = { _tag: "assigned", contract: cont, fleet: fleet, assignedAt: turn }
    return some({ ...com, contracts: [...ra.value, entry] })
  } else {
    return none
  }
}
