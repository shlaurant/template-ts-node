import * as rl from "readline/promises"

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

async function getCommand(readline: rl.Interface, data: any): Promise<UserCommand> {
  const input = await readline.question("enter command:")
  const cmd = input.split(" ")[0]
  const args = input.split("").slice(1)

  if (cmd === "exit") {
    return {
      type: "exit"
    }
  } else if (cmd == "skip") {
    return {
      type: "skip"
    }
  } else {
    throw Error(`unknown command: ${cmd}`)
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

  const data = {
    isOver: false,
    overReason: undefined,
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

  if (data.overReason) {
    console.log(data.overReason)
  }
  console.log("bye")
  process.exit(0)
}

void main()