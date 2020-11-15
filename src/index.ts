import dotenv from 'dotenv'
dotenv.config();

import 'express-cls-hooked'
import "reflect-metadata";
import {User} from "./entity/User";
import app from './app';
import container from "@/di/config";
import {Connection} from "typeorm/index";
import IConnectionProvider from "@/di/IConnectionProvider";
import TYPES from "@/di/TYPES";



const logger= container.createLogger();

(async () => {

  // await container.get<IConnectionProvider>(TYPES.ConnectionProvider)()

  app.listen(process.env.PORT);
  console.log(`http://localhost:${process.env.PORT}/api/`)
})()
