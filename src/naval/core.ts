export type Contract = Readonly<{}>

export type Company = Readonly<{
  contracts: ReadonlyArray<Contract>
}>

export function signContract(com: Company, cont: Contract): Company {
  return { ...com, contracts: [...com.contracts, cont] }
}