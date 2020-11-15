import dotenv from 'dotenv'
dotenv.config();

import 'express-cls-hooked'
import "reflect-metadata";
import {User} from "@entity/user/User2";
import app from './app';
import container from "@/di/config";
import {Connection} from "typeorm/index";
import IDbProvider from "@/di/IDbProvider";
import TYPES from "@/di/TYPES";



const logger= container.createLogger();

(async () => {

  // await container.get<IDbProvider>(TYPES.ConnectionProvider)()

  app.listen(process.env.PORT);
  console.log(`http://localhost:${process.env.PORT}/api/`)
})()
