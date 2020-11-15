import {Connection} from "typeorm/index";

export default interface IDbProvider {
  (): Promise<Connection>
}
