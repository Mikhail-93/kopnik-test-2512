
import app from './app';
import container from "@/di/container";
import {basename} from "path";


const logger= container.createLogger({name: basename(__filename)});

logger.info(`process.NODE_ENV = ${process.env.NODE_ENV}`);

(async () => {


  await container.dbProvider()

  app.listen(process.env.APP_PORT);
  logger.info(`Express server has started on port ${process.env.APP_PORT}. Open http://localhost:${process.env.APP_PORT}/api/test/ping?qwerty to see results`)
})()
