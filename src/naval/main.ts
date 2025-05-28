import * as rl from "readline/promises"
import { Quest } from "./quest"

type Ship = {
  id: number;
  upkeep: number
}

type Data = {
  isOver: boolean
  overReason?: string,
  balance: number,
  ships: Ship[],
  quests: Quest[]
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

  if (cmd === "exit") {
    return {
      type: "exit"
    }
  } else if (cmd === "skip") {
    return {
      type: "skip"
    }
  } else if (cmd === "show" && args[0] === "quests") {
    console.log(JSON.stringify(data.quests))
    return getCommand(readline, data)
  } else {
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
      { id: 0, upkeep: 1 }
    ],
    quests: []
  }

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