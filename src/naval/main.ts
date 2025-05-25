import * as rl from "readline/promises"

function isOver(data: any): boolean {
  return data.isOver
}

function display(data: any) {
  console.log(`balance: ${data.balance}`)
  console.log(`ships: ${JSON.stringify(data.ships)}`)
}

async function getInput(readline: rl.Interface, data: any): Promise<any> {
  return readline.question("enter command:")
}

function update(data: any, input: any) {
  if(input === 'exit') {
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
    const input = await getInput(readline, data)
    update(data, input)
  }

  console.log('bye')
  process.exit(0)
}

void main()