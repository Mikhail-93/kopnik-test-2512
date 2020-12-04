import request from "supertest";

import app from "@/app";


describe('login', () => {
  it('OK', async () => {
    const res = await request(app)
      .get('/api/test/login/1')
      .send()
    expect(res.status).toEqual(200)
  })
})
