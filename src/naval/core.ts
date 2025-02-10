import { none, Option, some } from "fp-ts/Option"
import { deleteAt, findIndex } from "fp-ts/ReadonlyArray"
import { EqId, identify } from "./id"

export type Contract = Readonly<{
  id: string
}>

export type Ship = Readonly<{}>

export type Fleet = Readonly<{
  id: string
  ships: ReadonlyArray<Ship>
}>

export type ContractEntry = {
  contract: Contract
  fleet: Option<Fleet>
}

export type Company = Readonly<{
  fleets: ReadonlyArray<Fleet>
  contracts: ReadonlyArray<ContractEntry>
}>

export function signContract(com: Company, cont: Contract): Company {
  return { ...com, contracts: [...com.contracts, { contract: cont, fleet: none }] }
}

export function createFleet(com: Company, ships: ReadonlyArray<Ship>): Company {
  return { ...com, fleets: [...com.fleets, identify({ id: "", ships: ships })] }
}

export function assignFleet(com: Company, cont: Contract, fleet: Fleet): Option<Company> {
  const idx = findIndex<ContractEntry>((e) => EqId.equals(e.contract, cont))(com.contracts)

  if (idx._tag === "Some") {
    const ra = deleteAt(idx.value)(com.contracts)
    if (ra._tag === "None") {
      return none
    }

    const entry: ContractEntry = { contract: cont, fleet: some(fleet) }
    return some({ ...com, contracts: [...ra.value, entry] })
  } else {
    return none
  }
}
