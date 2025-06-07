import { EnemyInformation, Quest } from "../core/model/quest"
import { getRandomElement } from "../../random/slice"
import { Combatant } from "../core/model/combat"
import { Combatants } from "./combatant"

const Quests: Quest[] = [
  { length: 1, reward: 1 },
  { length: 1, reward: 2 },
  { length: 2, reward: 2 },
  { length: 1, reward: 3 },
  { length: 3, reward: 3 },
  { length: 1, reward: 4 },
  { length: 2, reward: 4 },
  { length: 4, reward: 4 },
]

const QuestsWithEnemy: (Quest & EnemyInformation<Combatant>)[] = []

for (const e of Quests) {
  QuestsWithEnemy.push({
    ...e,
    minEnemies: 1,
    maxEnemies: 1,
    possibleEnemies: [{ ...Combatants[0] }],
  })
}

export function getRandomQuest(): Quest& EnemyInformation<Combatant> {
  const ret = getRandomElement(QuestsWithEnemy)
  if (ret._tag === "None") {
    throw new Error("quest is none")
  }

  return ret.value
}
