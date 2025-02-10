import { none, Option, some } from "fp-ts/Option"
import { deleteAt, findIndex } from "fp-ts/ReadonlyArray"
import * as n from "fp-ts/number"
import { struct } from "fp-ts/es6/Eq"

export type Identified = Readonly<{
  id: number;
}>

export const EqId = struct(
  {
    id: n.Eq
  }
)

export type Contract = Readonly<{
  id: number
}>

export type Fleet = Readonly<{
  id: number
}>

export type ContractEntry = {
  contract: Contract
  fleet: Option<Fleet>
}

export type Company = Readonly<{
  contracts: ReadonlyArray<ContractEntry>
  fleets: ReadonlyArray<Fleet>
}>

export function signContract(com: Company, cont: Contract): Company {
  return { ...com, contracts: [...com.contracts, { contract: cont, fleet: none }] }
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
