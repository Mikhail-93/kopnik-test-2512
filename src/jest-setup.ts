import dotenv from 'dotenv'
import container from "@/di/container";

dotenv.config({
  path: '.env.test'
})

import {types} from 'pg'
types.setTypeParser(20, Number);
