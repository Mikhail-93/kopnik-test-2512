import TYPES from "@/di/TYPES";
import {Connection, ConnectionOptions, createConnection} from "typeorm";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import container, {CustomContainer} from "@/di/container";
import IDbProvider from "@/di/db/IDbProvider";

container.bind<IDbProvider>(TYPES.dbProvider).toProvider<Connection>(context => {
  return async () => {
    if (context.container.isBound(TYPES.db)) {
      return context.container.get<Connection>(TYPES.db);
    }

    const options = context.container.get<PostgresConnectionOptions>(TYPES.dbOptions)
    const result = await createConnection(options)
    context.container.bind<Connection>(TYPES.db).toConstantValue(result)
    return result
  }
})
