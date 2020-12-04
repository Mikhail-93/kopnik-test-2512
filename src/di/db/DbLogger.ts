import {Logger as TypeORMLogger} from "typeorm/logger/Logger";
import Logger from "bunyan";
import {QueryRunner} from "typeorm";
import sqlFormatter from "sql-formatter";

export default class DbLogger implements TypeORMLogger {
  constructor(public logger: Logger) {
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    query= sqlFormatter.format(query)
    this.logger.debug(query, parameters || '')
  }

  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.logger.error(error, query, parameters || '')
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.logger.info(message)
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger.info(message)
  }

  log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner) {
    // TypeORM No classes were found using the provided glob pattern:  "src/subscriber/**/*.ts"
    // this.logger[level](message)
  }
}
