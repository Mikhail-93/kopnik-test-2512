import {Connection} from "typeorm/index";

export default interface IConnectionProvider {
  (): Promise<Connection>
}
