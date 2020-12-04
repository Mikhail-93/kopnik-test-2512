import express from "express";

import 'express-async-errors'
import bodyParser from "body-parser";
import httpContext from 'express-cls-hooked'
import cors from 'cors'

import welcome from "@/api/middleware/welcome"
import ping from "@api/test/ping";
import error from "@api/test/error";
import auth from "@api/middleware/authenticate";
import get from "@api/users/get";
import login from "@api/test/login";
import createUser from "@api/test/createUser";
import dbProvider from "@api/middleware/dbProvider";

const app = express()
app.use(cors({
  origin:  ['http://localhost:8080', 'https://staging.kopnik.org', 'https://kopnik.org'],
  credentials: true,
}))
app.use(bodyParser.json())
app.use(httpContext.middleware)
app.use(dbProvider)
app.use(welcome)
app.use(auth)

// users
app.get('/api/users/get', get)


//test
app.get('/api/test/ping', ping)
app.get('/api/test/error', error)
app.post('/api/test/createUser', createUser)
app.get('/api/test/login', login)

// обработчик ошибок должен подключаться последним use() https://expressjs.com/ru/guide/error-handling.html
app.use(require('@api/middleware/errorHandler'))

export default app
