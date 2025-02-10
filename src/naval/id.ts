import { struct } from "fp-ts/es6/Eq"
import * as s from "fp-ts/string"
import { v4 } from "uuid"

export type Identifiable = Readonly<{
  id: string;
}>

export const EqId = struct(
  {
    id: s.Eq
  }
)

export function identify<T extends Identifiable>(data: T): T {
  return { ...data, id: v4() }
}