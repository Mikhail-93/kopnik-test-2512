import request from "supertest";

import app from "@/app";

describe('errorHandler', () => {
  it('throw error', async () => {
    const res = await request(app)
      .get('/api/test/error')
      .send()
    expect(res.status).toEqual(201)
    expect(res.body).toHaveProperty('error')
    expect(res.body.error).toHaveProperty('error_msg', 'test error')
    expect(res.body.error).toHaveProperty('error_code',)
    expect(res.body.error).toHaveProperty('error_stack', )
  })
})
