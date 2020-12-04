import context from "@/context/context";
import plain from "@/plain/plain";

/**
 * Псевдо-стрим для добавления в лог переменных из контекста
 */
export default class ContextStream {
  write(rec) {
    // req_id
    const req_id = context.req_id
    if (req_id) {
      rec.req_id = req_id
    } else {
      delete rec.req_id
    }

    // user
    const user = context.user
    if (user) {
      rec.user = plain(user, {isCurrentUser: true})
    } else {
      delete rec.user
    }
  }
}
