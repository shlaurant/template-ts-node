export type Good = "Wheat" | "Wood"

export type FiefConfig = Readonly<{
  consumeCoefficient: number;
  growthRate: number;
  shrinkRate: number;
}>

export type Field = Readonly<{
  name: string
  outputs: Map<Good, number>
}>

export type Fief = Readonly<{
  size: number;
  population: number;
  fields: ReadonlyArray<Field>
  reserves: Map<Good, number>
}>

export function produce(manor: Fief): Fief {
  const newReserves = manor.reserves

  manor.fields.forEach(e => {
    e.outputs.forEach((v, k) => {
      newReserves.set(k, v + (manor.reserves.get(k) ?? 0))
    })
  })

  return { ...manor, reserves: newReserves }
}

export function consume(config: FiefConfig, manor: Fief): Fief {
  const reserve = manor.reserves.get("Wheat") ?? 0
  const consumption = manor.population * config.consumeCoefficient

  if (consumption < reserve) {
    manor = { ...manor, population: Math.floor(manor.population * (1 + config.growthRate)) }
  } else if (consumption > reserve) {
    manor = { ...manor, population: Math.floor(manor.population * (1 - config.shrinkRate)) }
  }

  return {
    ...manor,
    reserves: manor.reserves.set(
      "Wheat",
      Math.max(reserve - consumption, 0)
    )
  }
}