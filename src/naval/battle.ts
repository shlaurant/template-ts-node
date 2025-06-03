import * as f from "fp-ts/function"
import { gaussianRandom } from "../random/normal-distribution"

export type Ship = {
  hull: number
  armor: number
  penetration: number
  dmg: number
  guns: number
  accuracy: number // [0, 1)
  // range: number
  // speed: number
}

export type BattleField = {
  // distance: number
  left: Ship
  right: Ship
}

function main() {
  const bf: BattleField = {
    left: { accuracy: 0.5, armor: 1, dmg: 1, guns: 5, hull: 10, penetration: 1 },
    right: { accuracy: 0.5, armor: 1, dmg: 1, guns: 5, hull: 10, penetration: 1 },
  }

  run(bf)
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

  df.right.hull -= ret1.dmg
  df.left.hull -= ret2.dmg
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
