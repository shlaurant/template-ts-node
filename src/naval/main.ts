import * as rl from "readline/promises"
import { isQuestAssigned } from "./core/model/quest"
import * as f from "fp-ts/function"
import * as array from "fp-ts/Array"
import { giveId, id, Identifiable } from "./core/id"
import { isShipAssigned, Ship } from "./core/model/ship"
import { dispatchShips, DispatchShipsInput } from "./core/action/dispatch"
import { updateOnQuestShips } from "./core/system/quest"
import { Data, updateCheckDispatchReturn, updateDispatchShipsReturn } from "./data"
import { getRandomQuest } from "./data/quest"
import { Combatants } from "./data/combatant"

type UserCommandExit = {
  type: "exit"
}

type UserCommandSkip = {
  type: "next"
}

type UserCommandDispatchShips = {
  type: "dispatch"
  input: DispatchShipsInput
}

type UserCommand = UserCommandExit | UserCommandSkip | UserCommandDispatchShips

function isOver(data: any): boolean {
  return data.isOver
}

function display(data: Data) {
  data.events.forEach((e) => console.log(e))
  console.log(`turn: ${data.turn}`)
  console.log(`balance: ${data.balance}`)
  console.log(`upkeep: ${Array.from(data.ships.values()).reduce((prev, s) => prev + s.upkeep, 0)}`)
  console.log(`ships:`)
  for (const ship of data.ships.values()) {
    let str = `  * [id: ${ship.id}, upkeep: ${ship.upkeep}]`
    if (isQuestAssigned(ship)) {
      str += ` !On Quest ${ship.questId}`
    }
    console.log(str)
  }
  console.log("quests:")
  for (const quest of data.quests.values()) {
    console.log(
      `  * [id: ${quest.id}, length: ${quest.length}, reward: ${quest.reward}]`,
    )
  }
}

async function getCommand(readline: rl.Interface, data: Data): Promise<UserCommand> {
  const input = await readline.question("enter command:")
  const cmd = input.split(" ")[0]
  const args = input.split(" ").slice(1)

  switch (cmd) {
    case "exit":
      return {
        type: "exit",
      }
    case "next":
      return {
        type: "next",
      }
    case "show":
      switch (args[0]) {
        case "quests":
          console.log(JSON.stringify(Array.from(data.quests.values())))
          break
        case "ships":
          console.log(JSON.stringify(Array.from(data.ships.values())))
          break
        case "quest":
          console.log(JSON.stringify(data.quests.get(Number(args[1]))))
          break
        case "ship":
          console.log(JSON.stringify(data.ships.get(Number(args[1]))))
          break
      }
      return getCommand(readline, data)
    case "dispatch":
      const questId = id(args[0])
      const shipIds = args.slice(1).map((e) => id(e))
      const quest = data.quests.get(questId)
      if (!quest) {
        console.log(`wrong quest id ${questId}`)
        return getCommand(readline, data)
      }

      const ships = shipIds.map((e) => data.ships.get(e))
      if (ships.find((e) => e === undefined)) {
        console.log(`wrong ship ids ${shipIds}`)
        return getCommand(readline, data)
      }

      return {
        type: "dispatch",
        input: {
          turn: data.turn,
          quest: quest,
          ships: ships as Identifiable<Ship>[],
        },
      }
    default:
      console.log(`invalid input: ${input}`)
      return getCommand(readline, data)
  }
}

function update(data: Data, cmd: UserCommand) {
  data.events = []

  switch (cmd.type) {
    case "exit":
      data.isOver = true
      return
    case "next":
      f.pipe(
        data,
        (d) =>
          [
            d,
            updateOnQuestShips(
              d.turn,
              Array.from(d.quests.values()).filter((e) => isShipAssigned(e)),
              Array.from(d.ships.values()).filter((e) => isQuestAssigned(e)),
            ),
          ] as const,
        ([d, v]) => updateCheckDispatchReturn(d, v),
      )

      while (data.quests.size < 3) {
        const quest = giveId(getRandomQuest())
        data.quests.set(quest.id, quest)
      }

      for (const ship of data.ships.values()) {
        data.balance -= ship.upkeep
      }

      if (data.balance < 0) {
        data.isOver = true
        data.overReason = "bankrupt"
      }

      data.turn++

      return
    case "dispatch":
      f.pipe(cmd.input, dispatchShips, (x) => updateDispatchShipsReturn(data, x))
      return
    default:
      throw new Error(`unexpected cmd ${JSON.stringify(cmd)}`)
  }
}

async function main() {
  const readline = rl.createInterface(process.stdin, process.stdout)

  const data: Data = {
    turn: 0,
    isOver: false,
    overReason: undefined,
    balance: 10,
    ships: new Map(),
    quests: new Map(),
    events: [],
  }

  let ship = giveId({ upkeep: 1, combat: 1, ...Combatants[0] })
  data.ships.set(ship.id, ship)

  data.quests = f.pipe(
    [0, 1, 2],
    array.map(() => getRandomQuest()),
    array.map((quest) => giveId(quest)),
    array.reduce(data.quests, (m, e) => m.set(e.id, e)),
  )

  while (!isOver(data)) {
    console.clear()
    display(data)
    const input = await getCommand(readline, data)
    update(data, input)
  }

  if (data.overReason) {
    console.log(data.overReason)
  }
  console.log("bye")
  process.exit(0)
}

void main()
