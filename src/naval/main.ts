import { number } from "fp-ts"

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class Ship {
  #hp: number
  #armor: number
  #dmg: number
  #penetration: number


  constructor(hp: number, armor: number, dmg: number, penetration: number) {
    this.#hp = hp
    this.#armor = armor
    this.#dmg = dmg
    this.#penetration = penetration
  }

  shoot(other: Ship): void {
    if (this.#penetration > other.#armor) {
      other.#hp = Math.max(0, other.#hp - this.#dmg)
    }
  }

  isAlive(): boolean {
    return this.#hp > 0
  }
}

class Division {
  #ships: Ship[]

  constructor(ships: Ship[]) {
    this.#ships = ships
  }

  isOver(): boolean {
    return this.#ships.every(ship => !ship.isAlive())
  }

  aliveShips(): Ship[] {
    return this.#ships.filter(ship => ship.isAlive())
  }

  getRandomAlive(): Ship {
    while (true) {
      const ret = this.#ships[Math.floor(Math.random() * this.#ships.length)]
      if (ret.isAlive()) {
        return ret
      }
    }
  }

  getRandomsAlive(n: number): Ship[] {
    const ret = []
    for (let i = 0; i < n; i++) {
      ret.push(this.getRandomAlive())
    }
    return ret
  }
}

enum RelativeDirection {
  CrossingParallel,
  DivergingParallel,
  CrossingQuarter,
  DivergingQuarter,
  CrossingT,
  DivergingT,
}

function defaultShip(): Ship {
  return new Ship(100, 5, 10, 10)
}

function main() {
  const div1 = new Division([defaultShip(), defaultShip()])
  const div2 = new Division([defaultShip(), defaultShip()])

  while (!div1.isOver() && !div2.isOver()) {
    const s1 = div1.aliveShips()
    const s2 = div2.aliveShips()

    const t1 = div2.getRandomsAlive(s1.length)
    const t2 = div1.getRandomsAlive(s2.length)

    for (let i = 0; i < s1.length; i++) {
      s1[i].shoot(t1[i])
    }

    for (let i = 0; i < s2.length; i++) {
      s2[i].shoot(t2[i])
    }
  }

  if (div1.isOver() && div2.isOver()) {
    console.log("draw")
  } else if (div1.isOver()) {
    console.log("div2 won")
  } else if (div2.isOver()) {
    console.log("div1 won")
  }
}

main()