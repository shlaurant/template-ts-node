export function filterMap<K, V>(
  predicate: (k: K, v: V) => boolean,
): (map: ReadonlyMap<K, V>) => Map<K, V> {
  return (map: ReadonlyMap<K, V>) => {
    const ret = new Map<K, V>()

    for (const [k, v] of map) {
      if (predicate(k, v)) {
        ret.set(k, v)
      }
    }

    return ret
  }
}
