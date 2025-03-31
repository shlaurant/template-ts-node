import { number } from "fp-ts"

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

type Ship = {
  hp: number
  armor: number
  dmg: number
  penetration: number
  range: number
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

function defaultShip(): Ship {
  return { armor: 5, dmg: 10, hp: 100, penetration: 10, range: 10 }
}

function main() {
  const distance = 20
  const div1: Division = {
    ships: [
      { armor: 5, dmg: 10, hp: 1, penetration: 10, range: 30 }
    ]
  }
  const div2: Division = {
    ships: [
      { armor: 5, dmg: 10, hp: 100, penetration: 10, range: 10 },
      { armor: 5, dmg: 10, hp: 100, penetration: 10, range: 10 }
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