import express from "express";

require('express-async-errors')
import bodyParser from "body-parser";
import {Request, Response} from "express";
import httpContext from 'express-cls-hooked'
import cors from 'cors'

import ping from "@api/utils/ping";
import error from "@api/utils/error";
import container from "@/di/config";
import {basename} from "path";
import get from "@api/user/get";
import login from "@api/user/login";

const app = express();
app.use(cors({
  origin:  ['http://localhost:8080', 'https://staging.kopnik.org', 'https://kopnik.org'],
  credentials: true,
}))
app.use(bodyParser.json());
app.use(httpContext.middleware)

// user
app.get('/api/users/get', get)
app.post('/api/users/login', login)

//utils
app.get('/api/utils/ping', ping)
app.get('/api/utils/error', error)


// обработчик ошибок должен подключаться последним use() https://expressjs.com/ru/guide/error-handling.html
app.use(require('@api/middleware/errorHandler'))

export default app
