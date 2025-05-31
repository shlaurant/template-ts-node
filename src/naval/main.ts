import * as rl from "readline/promises"
import { Quest, Quests } from "./quest"
import * as f from "fp-ts/function"
import * as array from "fp-ts/Array"
import { getRandomElement } from "../random/slice"
import { giveId, Id, id, Identifiable } from "./id"
import { Ship } from "./ship"
import { dispatchShips, DispatchShipsInput } from "./command"

type Data = {
  turn: number
  isOver: boolean
  overReason?: string,
  balance: number,
  ships: Map<Id, Identifiable<Ship>>,
  quests: Map<Id, Identifiable<Quest>>
}

type UserCommandExit = {
  type: "exit"
}

type UserCommandSkip = {
  type: "skip"
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
        type: "exit"
      }
    case "skip":
      return {
        type: "skip"
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
      const shipIds = args.slice(1).map(e => id(e))

      return {
        type: "dispatch",
        input: {
          turn: data.turn,
          quest: data.quests.get(questId)!,
          ships: shipIds.map(e => data.ships.get(e)!)
        }
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
    case "skip":
      //do nothing
      break
    case "dispatch":
      const output = f.pipe(cmd.input, dispatchShips)
      data.quests.set(output.quest.id, output.quest)
      output.ships.forEach(e => data.ships.set(e.id, e))
      break
    default:
      throw new Error(`unexpected cmd ${JSON.stringify(cmd)}`)
  }

  for (const ship of data.ships.values()) {
    data.balance -= ship.upkeep
  }

  if (data.balance < 0) {
    data.isOver = true
    data.overReason = "bankrupt"
  }

  data.turn++

  return ret
}

async function main() {
  const readline = rl.createInterface(
    process.stdin,
    process.stdout
  )

  const data: Data = {
    turn: 0,
    isOver: false,
    overReason: undefined,
    balance: 10,
    ships: new Map(),
    quests: new Map()
  }

  data.ships.set(0, { id: 0, upkeep: 1, combat: 1 })

  data.quests = f.pipe(
    [0, 1, 2],
    array.map(() => getRandomElement(Quests)),
    array.compact,
    array.map((quest) => giveId(quest)),
    array.reduce(data.quests, (m, e) => m.set(e.id, e))
  )

  while (!isOver(data)) {
    display(data)
    const input = await getCommand(readline, data)
    const events = update(data, input)
    events.forEach(console.log)
  }

  if (data.overReason) {
    console.log(data.overReason)
  }
  console.log("bye")
  process.exit(0)
}

void main()