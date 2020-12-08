import container from "@/di/container"
import {getManager, getRepository} from "typeorm"
import {User} from "@entity/user/User.entity"
import userFactory from "@entity/user/test-utils/testUserFactory";

describe('User', () => {
  beforeEach(async () => {
    await container.provideDatabase()
  })

  it('find', async () => {
    const manager = getManager()
    const user = userFactory('create', {})
    await manager.save(user)

    const user2 = await manager.findOne(User, user.id)

    expect(user.mid).toBe(user2.mid)
  })
})
