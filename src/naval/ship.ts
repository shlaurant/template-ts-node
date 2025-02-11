export type Reactor = Readonly<{
  power: number;
}>

export type Machinery = Readonly<{
  powerConsumption: number
}>

export type Gun = Readonly<{
  powerConsumption: number
}>

export type Ship = Readonly<{
  displacement: number
  reactor: Reactor
  machinery: Machinery
  primaryGuns: ReadonlyArray<Gun>
}>
