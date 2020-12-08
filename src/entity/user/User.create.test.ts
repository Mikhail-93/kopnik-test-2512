import container from "@/di/container"
import {getManager, getRepository} from "typeorm"
import {User} from "@entity/user/User.entity"
import userFactory from "@entity/user/test-utils/testUserFactory";

describe('User', () => {
  beforeEach(async () => {
    await container.provideDatabase()
  })

  it('create', async () => {
    const user = userFactory('create', {})
    const manager = getManager()
    await manager.save(user)
  })
})
