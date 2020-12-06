import container from "@/di/container"
import {getManager, getRepository} from "typeorm"
import {User} from "@entity/user/User.entity"
import userFactory from "@entity/user/userFactory";
import createUser from "@entity/user/createUser";

describe('createUser', () => {
  beforeEach(async () => {
    await container.provideDatabase()
  })

  it('success', async () => {
    const user = await createUser('createUser.test.ts', {})
    const manager = getManager()
    await manager.save(user)
  })
})
