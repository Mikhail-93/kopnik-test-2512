import {EntityManager, getConnection} from "typeorm";
import context from "@/context/context";

export default async function <T>(body: (em?: EntityManager) => Promise<T>): Promise<T> {
  const result = await getConnection().transaction<T>(async (em) => {
    context.set('em', em)
    try {
      const result = await body(em)
      return result
    } finally {
      context.set('em', null)
    }
  })
  return result
}
