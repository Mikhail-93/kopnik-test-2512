import IToken from "@api/middleware/authenticate/IToken";
import md5 from 'md5'

export default function (token: IToken) {
  const result = md5(`expire=${token.expire}mid=${token.mid}secret=${token.secret}sid=${token.sid}${process.env.VK_CLIENT_SECRET}`)
  return result
}
