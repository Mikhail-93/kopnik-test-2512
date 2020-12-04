import request from "supertest";

import app from "@/app";


describe('createUser', () => {
  it('OK', async () => {
    const res = await request(app)
      .post('/api/test/createUser')
      .send({
        lastName: '1:58:34 AM',
        firstName: '1:58:34 AM',
        patronymic: '1:58:34 AM',
        nickname: '1:58:34 AM',
        birthyear: 2020,
        passport: '0123',
        location: { lat: 30, lng: 50 },
        photo: 'photo/1:58:34 AM',
        smallPhoto: 'smallPhoto/1:58:34 AM',
        status: 0,
        locale: 'ru',
        role: 1,
        rank: 1,
        identifier: 1607122714993993,
        email: '1607122714993993@kopnik.ru',
        access_token: 'access_token1607122714993993'
      })
    expect(res.status).toEqual(200)
    expect(res.body.response).toHaveProperty('id')
  })
})
