type physical_prop = {
  size: number
  weight: number
}

type power_consumption_prop = {
  power_consumption: number
}

type hull_prop = physical_prop & {
  armor: number
}

type reactor_prop = physical_prop & {
  power_generation: number
}

type machinery_prop = physical_prop &
  power_consumption_prop & {
    thrust: number
  }

type mass_driver_prop = physical_prop &
  power_consumption_prop & {
    range: number
    damage: number
    guns: number
    cooldown: number
  }

class ship {}

class fleet {}

class Battle {
  tick(): void {

  }
}

function main() {}

main()
