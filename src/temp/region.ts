export type Good = "Wheat" | "Wood"

export type Field = Readonly<{
  name: string
  outputs: Map<Good, number>
}>

export type Fief = Readonly<{
  size: number;
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