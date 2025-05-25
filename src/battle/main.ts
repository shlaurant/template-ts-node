type Slot = {
  y: number
  x: number
}

type Board<T extends Slot> = T[][]

function createBoard<T extends Slot>(y: number, x: number, value: T): Board<T> {
  const ret: T[][] = []

  for (let i = 0; i < y; ++i) {
    const rw: T[] = []
    for (let j = 0; j < x; ++j) {
      rw.push(value)
    }
    ret.push(rw)
  }

  return ret
}

type Character = {
  id: number
  hp: number
}

const NullCharacter = {
  id: -1,
  hp: -1
}

type CharacterSlot = Slot & { character: Character }
