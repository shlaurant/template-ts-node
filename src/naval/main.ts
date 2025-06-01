import * as rl from "readline/promises"
import { isQuestAssigned, Quests } from "./core/quest"
import * as f from "fp-ts/function"
import * as array from "fp-ts/Array"
import { getRandomElement } from "../random/slice"
import { giveId, id, Identifiable } from "./core/id"
import { isShipAssigned, Ship } from "./core/ship"
import { dispatchShips, DispatchShipsInput } from "./core/command"
import { checkDispatch } from "./core/turn"
import { Data, updateDispatchShipsReturn, updateCheckDispatchReturn } from "./data"

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

function display(data: any) {
  console.log(`turn: ${data.turn}`)
  console.log(`balance: ${data.balance}`)
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

function update(data: Data, cmd: UserCommand): string[] {
  const ret: string[] = []

  switch (cmd.type) {
    case "exit":
      data.isOver = true
      return ret
    case "next":
      f.pipe(
        data,
        (d) =>
          [d, checkDispatch(
            d.turn,
            Array.from(d.quests.values()).filter((e) => isShipAssigned(e)),
            Array.from(d.ships.values()).filter((e) => isQuestAssigned(e)),
          )] as const,
        ([d, v])=> updateCheckDispatchReturn(d, v),
      )

      for (const ship of data.ships.values()) {
        data.balance -= ship.upkeep
      }

      if (data.balance < 0) {
        data.isOver = true
        data.overReason = "bankrupt"
      }

      data.turn++

      return ret
    case "dispatch":
      f.pipe(cmd.input, dispatchShips, (x) => updateDispatchShipsReturn(data, x))
      return ret
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
    events:[]
  }

  let ship = giveId({ upkeep: 1, combat: 1 })
  data.ships.set(ship.id, ship)

  data.quests = f.pipe(
    [0, 1, 2],
    array.map(() => getRandomElement(Quests)),
    array.compact,
    array.map((quest) => giveId(quest)),
    array.reduce(data.quests, (m, e) => m.set(e.id, e)),
  )

  while (!isOver(data)) {
    display(data)
    const input = await getCommand(readline, data)
    const events = update(data, input)
    events.forEach((e) => console.log(e))
  }

  if (data.overReason) {
    console.log(data.overReason)
  }
  console.log("bye")
  process.exit(0)
}

void main()
