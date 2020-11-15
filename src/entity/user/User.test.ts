import container from "@/di/config"
import {getManager, getRepository} from "typeorm"
import {User} from "@entity/user/User"
import userFactory from "@/testUtils/userFactory";

describe('User', () => {
  beforeEach(async () => {
    await container.dbProvider()
  })

  it('load', async () => {
    const user = await getRepository(User).findOneOrFail({id: 1})
    console.log(user)
  })

  it('create', async () => {
    const user = userFactory('create', {})
    const manager= getManager()
    await manager.save(user)
    // await getRepository(User).save(user)
    console.log(user)
  })
})
