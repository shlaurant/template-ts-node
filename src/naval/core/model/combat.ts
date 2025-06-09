import { Id, Identifiable } from "../id"
import { gaussianRandom } from "../../../random/normal-distribution"
import { getRandomElement } from "../../../random/slice"
import assert from "node:assert"
import * as f from "fp-ts/function"
import * as ra from "fp-ts/ReadonlyArray"

export type Combatant = Readonly<{
  hull: number
  armor: number
  penetration: number
  dmg: number
  guns: number
  accuracy: number
}>

export type SalvoData = Readonly<{
  from: Id
  to: Id
  fired: number
  hits: number
  penetrated: number
  damage: number
}>

export type RoundData = Readonly<{
  left: ReadonlyArray<SalvoData>
  right: ReadonlyArray<SalvoData>
}>

export type CombatResult = Readonly<{}>

export function doBattle(
  left: ReadonlyArray<Identifiable<Combatant>>,
  right: ReadonlyArray<Identifiable<Combatant>>,
): ReadonlyArray<RoundData> {
  const ret: RoundData[] = []

  while (left.some((e) => e.hull > 0) && right.some((e) => e.hull > 0)) {
    left = f.pipe(
      fireMultiple(right, left),
      (salvos)=> {
        salvos.forEach(e=>ret.push(e))
        return salvos
      },
      ra.reduce(left, (combatants, salvo) => damage(combatants, salvo.to, salvo.damage)),
    )
  }

  return ret
}

function damage(
  combatants: ReadonlyArray<Identifiable<Combatant>>,
  id: Id,
  value: number,
): ReadonlyArray<Identifiable<Combatant>> {
  const targetIndex = combatants.findIndex((e) => e.id === id)
  assert(targetIndex !== -1)
  const update = { ...combatants[targetIndex], hull: combatants[targetIndex].hull - value }

  return ra.unsafeUpdateAt(targetIndex, update, combatants)
}

function getRandomCombatant(arr: ReadonlyArray<Identifiable<Combatant>>): Identifiable<Combatant> {
  const randomTarget = getRandomElement(arr.filter((e) => e.hull > 0))
  assert(randomTarget._tag === "Some")
  return randomTarget.value
}

function fireMultiple(
  from: ReadonlyArray<Identifiable<Combatant>>,
  to: ReadonlyArray<Identifiable<Combatant>>,
): ReadonlyArray<SalvoData> {
  return f.pipe(
    from.filter((e) => e.hull > 0),
    ra.map((e) => fire(e, getRandomCombatant(to))),
  )
}

function fire(from: Identifiable<Combatant>, to: Identifiable<Combatant>): SalvoData {
  const hits = getHits(from)

  let penetrated = 0
  for (let i = 0; i < hits; ++i) {
    penetrated += isHit(from.penetration, to.armor) ? 1 : 0
  }

  return {
    from: from.id,
    to: to.id,
    fired: from.guns,
    hits: hits,
    penetrated: penetrated,
    damage: penetrated * from.dmg,
  }
}

function isHit(pen: number, armor: number) {
  const adjustedPen = gaussianRandom(pen, pen / 5)
  return adjustedPen > armor
}

function getHits(c: Combatant): number {
  let ret = 0

  for (let i = 0; i < c.guns; ++i) {
    ret += c.accuracy > Math.random() ? 1 : 0
  }

  return ret
}
