export type dice = Readonly<{
  faces: ReadonlyArray<number>
}>

export function roll_dice(dice: dice): number {
  return dice.faces[Math.floor(Math.random() * dice.faces.length)]
}

export type character = Readonly<{
  hp: number
  dmg: number
  armor: number
  attack: ReadonlyArray<dice>
  defense: ReadonlyArray<dice>
}>

type dice_rolls = Readonly<{
  attack: number
  defense: number
}>

function roll_dices(character: character): dice_rolls {
  return {
    attack:
      character.attack.map(dice => roll_dice(dice)).reduce((acc, val) => acc + val, 0),
    defense:
      character.defense.map(dice => roll_dice(dice)).reduce((acc, val) => acc + val, 0)
  }
}

function damage(attacker: character, defender: character): character {
  if (attacker.dmg > defender.armor) {
    return { ...defender, hp: defender.hp - (attacker.dmg - defender.armor) }
  } else {
    return defender
  }
}

export function clash(lhs: character, rhs: character): [character, character] {
  let ret: [character, character] = [lhs, rhs]

  const lhs_rolls = roll_dices(lhs)
  const rhs_rolls = roll_dices(rhs)

  if (lhs_rolls.attack > rhs_rolls.defense) {
    ret[1] = damage(lhs, rhs)
  }

  if (rhs_rolls.attack > lhs_rolls.defense) {
    ret[0] = damage(rhs, lhs)
  }

  return ret
}
