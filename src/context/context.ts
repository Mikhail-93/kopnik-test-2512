/**

 * simple wrapper over express-cls-hooked to provide autocomplete
 */


import {get, set} from 'express-cls-hooked'
import {User} from "@entity/user/User.entity";
import {EntityManager} from "typeorm";
import IToken from "@api/middleware/authenticate/IToken";

const context = {
  get: get as (key: string) => any,
  set: set as (key: string, value: any) => any,

  get token() {
    return get('token') as IToken
  },
  get user() {
    return get('user') as User
  },
  get em() {
    return get('em') as EntityManager
  },
  get req_id() {
    return get('req_id') as number
  }
}

export default context
