import * as rl from "readline/promises"
import { Quest, Quests } from "./quest"
import * as f from "fp-ts/function"
import * as array from "fp-ts/Array"
import { getRandomElement } from "../random/slice"
import { giveId, Identifiable } from "./id"
import { Ship } from "./ship"

type Data = {
  isOver: boolean
  overReason?: string,
  balance: number,
  ships: Identifiable<Ship>[],
  quests: Identifiable<Quest>[]
}

type UserCommandExit = {
  type: "exit"
}

type UserCommandSkip = {
  type: "skip"
}

type UserCommand = UserCommandExit | UserCommandSkip

function isOver(data: any): boolean {
  return data.isOver
}

function display(data: any) {
  console.log(`balance: ${data.balance}`)
  console.log(`ships: ${JSON.stringify(data.ships)}`)
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
          console.log(JSON.stringify(data.quests))
          break
        case "ships":
          console.log(JSON.stringify(data.ships))
          break
      }
      return getCommand(readline, data)
    default:
      console.log(`invalid input: ${input}`)
      return getCommand(readline, data)
  }
}

function update(data: any, cmd: UserCommand) {
  if (cmd.type === "exit") {
    data.isOver = true
    return
  }

  for (const ship of data.ships) {
    data.balance -= ship.upkeep
  }

  if (data.balance < 0) {
    data.isOver = true
    data.overReason = "bankrupt"
  }
}

async function main() {
  const readline = rl.createInterface(
    process.stdin,
    process.stdout
  )

  const data: Data = {
    isOver: false,
    overReason: undefined,
    balance: 0,
    ships: [
      { id: 0, upkeep: 1, combat: 1 }
    ],
    quests: []
  }

  data.quests = f.pipe(
    [0, 1, 2],
    array.map(() => getRandomElement(Quests)),
    array.compact,
    array.map((quest) => giveId(quest))
  )

  while (!isOver(data)) {
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