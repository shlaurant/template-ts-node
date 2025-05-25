function isOver(data: any): boolean {

}

function display(data: any) {

}

function getInput(data: any): any {

}

function update(data: any, input: any) {

}

function main() {
  const data = {}

  while (!isOver(data)) {
    display(data)
    const input = getInput(data)
    update(data, input)
  }
}