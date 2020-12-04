import request from "supertest";

import app from "@/app";


describe('authenticate', () => {
  it('empty', async () => {
    const res = await request(app)
      .get('/api/test/ping')
      .send()
    expect(res.status).toEqual(200)
  })
})
