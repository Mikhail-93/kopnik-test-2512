import request from "supertest";

import app from "@/app";
import {getRepository} from "typeorm";
import {User} from "@entity/user/User.entity";


describe('createUser', () => {
  it('OK', async () => {
    const res = await request(app)
      .post('/api/test/createUser')
      .send()
    expect(res.status).toEqual(200)
    expect(res.body.response).toBeTruthy()

    const res2 = await request(app)
      .post('/api/test/createUser')
      .send({
        witness_id: res.body.response,
        foreman_id: res.body.response,
        foremanRequest_id: res.body.response,
      })
    expect(res2.status).toEqual(200)
    const user = await getRepository(User).findOneOrFail({
      where: {
        id: res2.body.response
      },
      relations: ["foreman", "foremanRequest", "witness"]
    })
    expect(user.foreman.id).toBe(res.body.response)
    expect(user.witness.id).toBe(res.body.response)
    expect(user.foremanRequest.id).toBe(res.body.response)
  })
})
