import { none, Option, some } from "fp-ts/Option"

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

type Ship = {
  id: number
  hp: number
  armor: number
  dmg: number
  penetration: number
  range: number
  speed: number
}

function eqShip(x: Ship, y: Ship) {
  return x.id === y.id
}

function shoot(from: Ship, other: Ship, distance: number): void {
  if (distance > from.range) {
    return
  }

  if (from.penetration > other.armor) {
    other.hp = Math.max(0, other.hp - from.dmg)
  }
}

function isAlive(s: Ship): boolean {
  return s.hp > 0
}

type Division = {
  ships: Ship[]
}

function eqDivision(x: Division, y: Division): boolean {
  if (x.ships.length !== y.ships.length) {
    return false
  }

  for (let i = 0; i < x.ships.length; i++) {
    if (!eqShip(x.ships[i], y.ships[i])) {
      return false
    }
  }

  return true
}

function speed(div: Division): number {
  let ret = Number.MAX_SAFE_INTEGER

  div.ships.forEach((ship) => {
    ret = Math.min(ret, ship.speed)
  })

  return ret
}

function isOver(div: Division): boolean {
  return div.ships.every(ship => !isAlive(ship))
}

function shipsAlive(div: Division): Ship[] {
  return div.ships.filter(ship => isAlive(ship))
}

function getRandomAlive(div: Division): Ship {
  while (true) {
    const ret = div.ships[Math.floor(Math.random() * div.ships.length)]
    if (isAlive(ret)) {
      return ret
    }
  }
}

function getRandomsAlive(div: Division, n: number): Ship[] {
  const ret = []
  for (let i = 0; i < n; i++) {
    ret.push(getRandomAlive(div))
  }
  return ret
}

type BattleField = {
  divisions: Map<number, Division>
  distances: Map<number, Map<number, number>> // id - id -distance
}

function idOf(bf: BattleField, div: Division): Option<number> {
  for (const [k, v] of bf.divisions) {
    if (eqDivision(v, div)) {
      return some(k)
    }
  }

  return none
}

function addDivision(bf: BattleField, div: Division): boolean {
  for (const [_, v] of bf.divisions) {
    if (eqDivision(v, div)) {
      return false
    }
  }

  const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  for (const [k, _] of bf.divisions) {
    const t = bf.distances.get(k)
    if (t == undefined) {
      throw new Error("irrecoverable error")
    }

    t.set(id, 100)
  }

  const m = new Map()
  for (const [k, _] of bf.divisions) {
    m.set(k, 100)
  }

  bf.distances.set(id, m)
  bf.divisions.set(id, div)
}

function distance(bf: BattleField, lhs: Division, rhs: Division): Option<number> {
  const lid = idOf(bf, lhs)
  const rid = idOf(bf, rhs)

  if (lid._tag === "None" || rid._tag == "None") {
    return none
  }

  const a = bf.distances.get(lid.value)
  if (a === undefined) {
    return none
  }

  const dist = a.get(rid.value)

  return dist !== undefined ? some(dist) : none
}

function updateDistance(bf: BattleField, lhs: Division, rhs: Division, distance: number): boolean {
  const lid = idOf(bf, lhs)
  const rid = idOf(bf, rhs)

  if (lid._tag === "None" || rid._tag == "None") {
    return false
  }

  const a = bf.distances.get(lid.value)
  const b = bf.distances.get(rid.value)
  if (a == undefined || b == undefined) {
    return false
  }

  a.set(rid.value, distance)
  b.set(lid.value, distance)
}

type Maneuver = "CloseDown" | "KeepDistance" | "Disengage"

type Target = {
  division: Division
  maneuver: Maneuver
}

type CommandedDivision = {
  scoutedEnemyDivisions: Division[]
  currentTarget: Option<Target>
}

enum RelativeDirection {
  CrossingParallel,
  DivergingParallel,
  CrossingQuarter,
  DivergingQuarter,
  CrossingT,
  DivergingT,
}

type RelativePosition = {
  distance: number
  direction: RelativeDirection
}

function main() {
  const distance = 20
  const div1: Division = {
    ships: [
      { id: 1, armor: 5, dmg: 10, hp: 1, penetration: 10, range: 30, speed: 10 }
    ]
  }
  const div2: Division = {
    ships: [
      { id: 2, armor: 5, dmg: 10, hp: 100, penetration: 10, range: 10, speed: 10 },
      { id: 3, armor: 5, dmg: 10, hp: 100, penetration: 10, range: 10, speed: 10 }
    ]
  }
  console.log(`div1: ${JSON.stringify(div1)}`)
  console.log(`div2: ${JSON.stringify(div2)}`)

  while (!isOver(div1) && !isOver(div2)) {
    const s1 = shipsAlive(div1)
    const s2 = shipsAlive(div2)

    const t1 = getRandomsAlive(div2, s1.length)
    const t2 = getRandomsAlive(div1, s2.length)

    for (let i = 0; i < s1.length; i++) {
      shoot(s1[i], t1[i], distance)
      console.log(`${JSON.stringify(s1[i])} fires at ${JSON.stringify(t1[i])}`)
    }

    for (let i = 0; i < s2.length; i++) {
      shoot(s2[i], t2[i], distance)
      console.log(`${JSON.stringify(s2[i])} fires at ${JSON.stringify(t2[i])}`)
    }

    console.log(`div1: ${JSON.stringify(div1)}`)
    console.log(`div2: ${JSON.stringify(div2)}`)
  }

  if (isOver(div1) && isOver(div2)) {
    console.log("draw")
  } else if (isOver(div1)) {
    console.log("div2 won")
  } else if (isOver(div2)) {
    console.log("div1 won")
  }
}

main()