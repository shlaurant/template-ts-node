export function gaussianRandom(mean: number = 0, stdev: number = 1) {
  let u = 1
  while (!(u < 1)) {
    u = 1 - Math.random()
  }
  const v = Math.random()
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean
}
