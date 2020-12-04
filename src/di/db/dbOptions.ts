import TYPES from "@/di/TYPES";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import container, {CustomContainer} from "@/di/container";
import DbLogger from "@/di/db/DbLogger";

container.bind<PostgresConnectionOptions>(TYPES.dbOptions).toDynamicValue(context => {
  const result = {
    ...(context.container as CustomContainer).constants.db,
    namingStrategy: new SnakeNamingStrategy(),
    type: "postgres",
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number.parseInt(process.env.DB_PORT),
    entities: ["src/entity/**/*.entity.ts",],
    migrations: ["src/migration/*.ts"],
    cli: {
      entitiesDir: "src/entity",
      migrationsDir: "src/migration",
    },
    logger: new DbLogger(container.createLogger({name: 'db'}))
  } as PostgresConnectionOptions
  return result
}).inSingletonScope()
