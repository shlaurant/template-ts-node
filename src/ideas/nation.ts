export type Nation = Readonly<{
  name: string
  balance: number
  prestige: number
}>

export type StrategicResource = "Oil"
export type BonusResource = ""

export type Industry = Readonly<{
  type: "light" | "heavy" | "military"
  level: number
  output: number
  productionVaule:
}>

export type Region = Readonly<{
  population: number
  satisfaction: number
  education: number
  industries: ReadonlyArray<Industry>
  bonusResource?: BonusResource
  strategicResource?: StrategicResource
}>
