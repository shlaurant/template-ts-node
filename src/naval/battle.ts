import * as f from "fp-ts/function"
import * as ra from "fp-ts/ReadonlyArray"
import * as rm from "fp-ts/ReadonlyMap"
import * as n from "fp-ts/number"
import * as o from "fp-ts/Option"
import { gaussianRandom } from "../random/normal-distribution"
import { giveId, Id, Identifiable } from "./core/id"
import { getRandomElement } from "../random/slice"

type Ship = Readonly<{
  hull: number
  armor: number
  penetration: number
  dmg: number
  guns: number
  accuracy: number // [0, 1)
  // range: number
  // speed: number
}>

function damage<T extends Ship>(s: T, dmg: number): T {
  return {
    ...s,
    hull: s.hull - dmg,
  }
}

function isAfloat(s: Ship): boolean {
  return s.hull > 0
}

export type Division = Readonly<{
  ships: ReadonlyMap<Id, Identifiable<Ship>>
}>

function isEliminated(d: Division): boolean {
  return ra.every<Ship>((e) => !isAfloat(e))(Array.from(d.ships.values()))
}

function upsertShip(div: Division, ship: Identifiable<Ship>): Division {
  return {
    ...div,
    ships: rm.upsertAt(n.Eq)(ship.id, ship)(div.ships),
  }
}

function fireAtRandom(from: Identifiable<Ship>, div: Division): Division {
  const target = f.pipe(
    Array.from(div.ships.values()),
    ra.filter((e) => isAfloat(e)),
    getRandomElement,
  )
  if (target._tag === "None") {
    return div
  }

  const res = fireAt(from, target.value)
  console.log(`from: ${from.id}, to: ${target.value.id}, ${JSON.stringify(res)}`)

  return upsertShip(div, damage(target.value, res.dmg))
}

// Returns updated to
function fireDivision(from: Division, to: Division): Division {
  let ret = to

  for (const ship of Array.from(from.ships.values()).filter((e) => isAfloat(e))) {
    ret = fireAtRandom(ship, ret)
  }

  return ret
}

function tick2(
  left: Division,
  right: Division,
): {
  left: Division
  right: Division
} {
  return {
    left: fireDivision(right, left),
    right: fireDivision(left, right),
  }
}

function printDivision(div: Division) {
  const arr: string[] = []

  for (const s of div.ships.values()) {
    arr.push(`{id:${s.id}, hull:${s.hull}}`)
  }

  console.log(`[${arr.join(",")}]`)
}

function run2(left: Division, right: Division) {
  let round = 1;
  while (!(isEliminated(left) || isEliminated(right))) {
    const ret = tick2(left, right)
    left = ret.left
    right = ret.right
    console.log(`end of round ${round++}`)
    printDivision(left)
    printDivision(right)
  }
}

export type BattleField = {
  // distance: number
  left: Ship
  right: Ship
}

function main() {
  let left: Division = {
    ships: new Map(),
  }
  let right: Division = {
    ships: new Map(),
  }

  for (let i = 0; i < 5; ++i) {
    left = upsertShip(
      left,
      giveId({ accuracy: 0.5, armor: 10, dmg: 1, guns: 5, hull: 10, penetration: 12 }),
    )
  }
  for (let i = 0; i < 5; ++i) {
    right = upsertShip(
      right,
      giveId({ accuracy: 0.5, armor: 10, dmg: 1, guns: 5, hull: 10, penetration: 12 }),
    )
  }

  run2(left, right)
}

function run(df: BattleField) {
  while (df.left.hull > 0 && df.right.hull > 0) {
    tick(df)
    console.log(`left: ${df.left.hull} right: ${df.right.hull}`)
  }
}

function tick(df: BattleField) {
  const ret1 = fireAt(df.left, df.right)
  const ret2 = fireAt(df.right, df.left)

  console.log(JSON.stringify(ret1))
  console.log(JSON.stringify(ret2))

  df.right = damage(df.right, ret1.dmg)
  df.left = damage(df.left, ret2.dmg)
}

function isHit(pen: number, armor: number) {
  const adjustedPen = gaussianRandom(pen, pen / 5)
  return adjustedPen > armor
}

function fireAt(
  from: Ship,
  to: Ship,
): {
  fired: number
  hits: number
  penetrated: number
  dmg: number
} {
  const shells = fire(from)

  let hits = 0
  for (let i = 0; i < shells; ++i) {
    hits += isHit(from.penetration, to.armor) ? 1 : 0
  }

  return {
    fired: from.guns,
    hits: shells,
    penetrated: hits,
    dmg: hits * from.dmg,
  }
}

//return hits
function fire(s: Ship): number {
  let ret = 0

  for (let i = 0; i < s.guns; ++i) {
    ret += s.accuracy > Math.random() ? 1 : 0
  }

  return ret
}

main()
