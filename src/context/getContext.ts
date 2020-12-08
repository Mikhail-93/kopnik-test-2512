import context from "@/context/context";

export default function () {
  return {
    user: context.user,
    em: context.em,
    req_id: context.req_id,
    token: context.token,
  }
}
