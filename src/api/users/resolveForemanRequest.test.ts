import container from "@/di/container"
import {EntityManager, getManager, getRepository} from "typeorm"
import {User} from "@entity/user/User.entity"
import createTestUser from "@entity/user/test-utils/createTestUser";
import request from "supertest";
import app from "@/app";

describe('resolveForemanRequest', () => {
  let halfForeman: User,
    halfSubordinate: User,
    em: EntityManager
  beforeEach(async () => {
    await container.provideDatabase()
    em= getManager()
    halfForeman= await createTestUser('halfOldest')
    halfSubordinate= await createTestUser('halfYoungest',{
      foremanRequest_id: halfForeman.id,
    })
    await halfForeman
  })

  it('success', async () => {
    const res = await request(app)
      .post('/api/users/resolveForemanRequest')
      .set('T-Authorization', halfForeman.mid.toString())
      .send({
        id: halfSubordinate.id,
        status: true,
      })
    expect(res.status).toEqual(200)
    const subordinate= await em.findOneOrFail(User, halfSubordinate.id, {
      relations:['foremanRequest']
    })
    expect(subordinate.foremanRequest).toBeNull()
    expect(subordinate.foremanRequestChat.id).toBeNull()
    expect(subordinate.foremanRequestChat.inviteLink).toBeNull()
  })
})

