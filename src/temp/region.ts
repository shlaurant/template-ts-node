export type Good = "Wheat" | "Wood"

export type FiefConfig = Readonly<{
  consumeCoefficient: number;
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
  return {
    ...manor,
    reserves: manor.reserves.set(
      "Wheat",
      Math.max((manor.reserves.get("Wheat") ?? 0) - manor.population * config.consumeCoefficient, 0)
    )
  }
}