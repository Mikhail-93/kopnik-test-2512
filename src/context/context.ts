/**
 * simple wrapper over express-cls-hooked to provide autocomplete
 */


import * as aaa from 'express-cls-hooked'

const context = aaa as {
  get: (key: string) => any,
  set: (key: string, value: any) => any,
}

export default context
