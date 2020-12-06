import container from "@/di/container"
import {getManager, getRepository, Repository} from "typeorm"
import {User} from "@entity/user/User.entity"
import userFactory from "@entity/user/userFactory";
import createUser from "@entity/user/createUser";
import setUserForeman from "@entity/user/setUserForeman";

describe('tree', () => {
  let repository: Repository<User>

  beforeEach(async () => {
    await container.dbProvider()
    repository = getRepository(User)
  })

  it('foreman null => user', async () => {
    // create two users
    const foreman = await createUser('foreman', {})
    const subordinate = await createUser('subordinate', {})

    // set foreman
    await setUserForeman(subordinate, foreman, getManager())

    // checks
    const foreman2 = await repository.findOneOrFail(foreman.id, {
      relations: ['subordinates']
    })
    expect(foreman2.subordinates[0].id).toBe(subordinate.id)
  })
})
