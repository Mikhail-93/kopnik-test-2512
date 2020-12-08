import request from "supertest";
import {Base64} from 'js-base64';

import app from "@/app";
import IToken from "@api/middleware/authenticate/IToken";
import sig from "@api/middleware/authenticate/sig";
import {EntityManager, getManager,} from "typeorm";
import {User} from "@entity/user/User.entity";
import createUser from "@entity/user/createUser";
import container from "@/di/container";


describe('authenticate', () => {
  const VK_TEST_USER = parseInt(process.env.VK_TEST_USER)

  beforeAll(async ()=>{
    await container.provideDatabase()
  })

  it('empty header', async () => {
    const res = await request(app)
      .get('/api/test/ping')
      .send()
    expect(res.status).toEqual(200)
  })

  it('new user', async () => {
    // удаляем пользователя
    // await getManager().query(`delete from users_closure where id_ancestor=${VK_TEST_USER} or id_descendant=${VK_TEST_USER}`)
    await getManager().query(`truncate users_closure`)
    await getManager().delete(User, {
      mid: parseInt(process.env.VK_TEST_USER),
    })

    // делаем токен
    const token: IToken = {
      expire: new Date().getTime(),
      mid: VK_TEST_USER,
      secret: "OAuth",
      sid: '1234',
      sig: undefined
    }
    token.sig = sig(token)

    // пробуем прорваться
    const res = await request(app)
      .get('/api/test/ping')
      .set({'Authorization': Base64.encode(JSON.stringify(token))})
      .send()
    expect(res.status).toEqual(200)
  })

  it.only('existed user', async () => {
    // удаляем на всякий случай пользователя
    await getManager().query(`truncate users_closure`)
    await getManager().delete(User, {
      mid: VK_TEST_USER,
    })
    // создаем тестового пользователя
    await createUser('authenticate', {
      mid: VK_TEST_USER,
    })

    // делаем ему токен
    const token: IToken = {
      expire: new Date().getTime(),
      mid: VK_TEST_USER,
      secret: "OAuth",
      sid: '1234',
      sig: undefined
    }
    token.sig = sig(token)

    // пробуем прорваться
    const res = await request(app)
      .get('/api/test/ping')
      .set({'Authorization': Base64.encode(JSON.stringify(token))})
      .send()
    expect(res.status).toEqual(200)
  })
})
