import express from "express";

import 'express-async-errors'
import bodyParser from "body-parser";
import httpContext from 'express-cls-hooked'
import cors from 'cors'

import welcome from "@/api/middleware/welcome"
import ping from "@api/test/ping";
import error from "@api/test/error";
import authenticate from "@api/middleware/authenticate/authenticate";
import create from "@api/middleware/newUser";
import get from "@api/users/get";
import login from "@api/test/login";
import on_createUser from "@api/test/on_createUser";
import on_authorize from "@api/test/on_authorize";
import db from "@api/middleware/db";
import authorize from "@api/middleware/authorize";
import getEx from "@api/users/getEx";
import getWitnessRequests from "@api/users/getWitnessRequests";
import getTopInsideSquare from "@api/users/getTopInsideSquare";
import update from "@api/users/update";
import updateLocale from "@api/users/updateLocale";
import updateWitnessRequest from "@api/users/resolveWitnessRequest";
import isMessagesFromGroupAllowed from "@api/users/isMessagesFromGroupAllowed";
import putForemanRequest from "@api/users/putForemanRequest";
import getForemanRequests from "@api/users/getForemanRequests";
import resolveForemanRequest from "@api/users/resolveForemanRequest";
import resetForeman from "@api/users/resetForeman";
import getSubordinates from "@api/users/getSubordinates";
import getForeman from "@api/users/getForeman";
import StatusEnum from "@entity/user/StatusEnum";
import RoleEnum from "@entity/user/RoleEnum";
import {Transaction} from "typeorm";

const app = express()
app.use(cors({
  origin:  ['http://localhost:8080', 'https://localhost:8080','https://staging.kopnik.org', 'https://kopnik.org',],
  credentials: true,
}))
app.use(bodyParser.json())
app.use(httpContext.middleware)
app.use(db)
app.use(welcome)
app.use(authenticate)
app.use(create)

// users
app.get('/api/users/get', authorize(), get)
app.get('/api/users/getEx', authorize(), getEx)
app.get('/api/users/getWitnessRequests', authorize(), getWitnessRequests)
app.get('/api/users/getTopInsideSquare', authorize(), getTopInsideSquare)
app.post('/api/users/updateProfile', authorize(), update)
app.post('/api/users/updateLocale', authorize(), updateLocale)
app.post('/api/users/updateWitnessRequest', authorize(), updateWitnessRequest)
app.get('/api/users/isMessagesFromGroupAllowed', authorize(), isMessagesFromGroupAllowed)

// tree
app.post('/api/users/putForemanRequest', authorize({statuses:[StatusEnum.Confirmed], roles:[RoleEnum.Kopnik, RoleEnum.DanilovKopnik, RoleEnum.FutureKopnik]}), putForemanRequest)
app.get('/api/users/getForemanRequests', authorize(), getForemanRequests)
app.post('/api/users/updateForemanRequest', authorize(), resolveForemanRequest)
app.post('/api/users/resetForeman', authorize(), resetForeman)
app.get('/api/users/getSubordinates', authorize(), getSubordinates)
// app.get('/api/users/getForeman', authorize(), getForeman)


//test
app.get('/api/test/ping', ping)
app.get('/api/test/error', error)
app.post('/api/test/createUser', on_createUser)
app.get('/api/test/authorize', authorize(), on_authorize)
app.get('/api/test/login/:id', login)

// обработчик ошибок должен подключаться последним use() https://expressjs.com/ru/guide/error-handling.html
app.use(require('@api/middleware/errorHandler'))

export default app
