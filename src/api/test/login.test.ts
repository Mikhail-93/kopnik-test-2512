import request from "supertest";
import {Base64} from 'js-base64';
import app from "@/app";
import createUser from "@entity/user/createUser";
import container from "@/di/container";


describe('login', () => {
  let user
  beforeAll(async ()=>{
    await container.dbProvider()
    user= await createUser('login')
  })
  it('by user id', async () => {
    const res = await request(app)
      .get('/api/test/login/'+user.id)
      .send()
    const res2 = await request(app)
      .get('/api/test/authorize')
      .set('Authorization', Base64.encode(JSON.stringify(res.body.response)))
      .send()
    expect(res2.status).toEqual(200)
  })
})
