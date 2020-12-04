import express from "express";

require('express-async-errors')
import bodyParser from "body-parser";
import {Request, Response} from "express";
import httpContext from 'express-cls-hooked'
import cors from 'cors'

import welcome from "@/api/middleware/welcome"
import ping from "@api/test/ping";
import error from "@api/test/error";
import context from "@/context/context";
import auth from "@api/middleware/auth";

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(httpContext.middleware)
app.use(welcome)
app.use(auth)

//test
app.get('/api/test/ping', ping)
app.get('/api/test/error', error)

// обработчик ошибок должен подключаться последним use() https://expressjs.com/ru/guide/error-handling.html
app.use(require('@api/middleware/errorHandler'))

export default app
