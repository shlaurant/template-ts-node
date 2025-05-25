import * as rl from "readline/promises"

type UserCommandExit = {
  type: "exit"
}

type UserCommand = UserCommandExit

function isOver(data: any): boolean {
  return data.isOver
}

function display(data: any) {
  console.log(`balance: ${data.balance}`)
  console.log(`ships: ${JSON.stringify(data.ships)}`)
}

async function getCommand(readline: rl.Interface, data: any): Promise<UserCommand> {
  const input = await readline.question("enter command:")
  if (input === "exit") {
    return {
      type: "exit"
    }
  } else {
    throw Error(`unknown command: ${input}`)
  }
}

function update(data: any, cmd: UserCommand) {
  if (cmd.type === "exit") {
    data.isOver = true
  }
}

async function main() {
  const readline = rl.createInterface(
    process.stdin,
    process.stdout
  )

  const data = {
    isOver: false,
    balance: 0,
    ships: [
      { id: 0, upkeep: 1 }
    ]
  }

  while (!isOver(data)) {
    display(data)
    const input = await getCommand(readline, data)
    update(data, input)
  }

  console.log("bye")
  process.exit(0)
}

void main()