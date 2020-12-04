import request from "supertest";

import app from "@/app";

describe('errorHandler', () => {
  it('Текущее согласование не завершено', async () => {
    const res = await request(app)
      .get('/api/utils/error')
      .send()
    expect(res.status).toEqual(201)
    expect(res.body).toHaveProperty('error')
    expect(res.body.error).toHaveProperty('message', 'test error')
  })
})
