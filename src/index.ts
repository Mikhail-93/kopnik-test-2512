
import app from './app';
import container from "@/di/container";
import {basename} from "path";



const logger= container.createLogger({name: basename(__filename)});

(async () => {

  await container.dbProvider()

  app.listen(process.env.APP_PORT);
  console.log(`Express server has started on port ${process.env.APP_PORT}. Open http://localhost:${process.env.APP_PORT}/api/test/ping?qwerty to see results`)
})()
