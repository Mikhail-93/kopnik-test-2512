import container from "@/di/container"
import {getManager, getRepository, Repository} from "typeorm"
import {User} from "@entity/user/User.entity"
import userFactory from "@entity/user/test-utils/testUserFactory";
import createUser from "@entity/user/test-utils/createTestUser";
import setUserForeman from "@entity/user/setUserForeman";
import transaction from "@/transaction/transaction";

describe('tree', () => {
  let repository: Repository<User>,
    foreman: User,
    subordinate: User

  beforeEach(async () => {
    await container.provideDatabase()
    repository = getRepository(User)
  })

  it('foreman null => user', async () => {
    await transaction(async () => {
      // create two users
      foreman = await createUser('foreman', {})
      subordinate = await createUser('subordinate', {})

      // set foreman
      await setUserForeman(subordinate, foreman, getManager())

      // checks
      foreman = await repository.findOneOrFail(foreman.id, {
        relations: ['subordinates']
      })
      subordinate = await repository.findOneOrFail(subordinate.id, {
        relations: ['foreman']
      })
      expect(foreman.subordinates[0].id).toBe(subordinate.id)
      expect(foreman.rank).toBe(2)
      expect(subordinate.foreman.id).toBe(foreman.id)
      expect(subordinate.rank).toBe(1)
    })
  })
  it('foreman user=>null', async () => {
    await transaction(async () => {
      // create two users
      foreman = await createUser('foreman', {})
      subordinate = await createUser('subordinate', {foreman_id: foreman.id})

      // set foreman
      await setUserForeman(subordinate, null, getManager())

      // checks
      foreman = await repository.findOneOrFail(foreman.id, {
        relations: ['subordinates']
      })
      subordinate = await repository.findOneOrFail(subordinate.id, {
        relations: ['foreman']
      })
      expect(foreman.subordinates).toHaveLength(0)
      expect(foreman.rank).toBe(1)
      expect(subordinate.foreman).toBeNull()
      expect(subordinate.rank).toBe(1)
    })
  })

  it('foreman on create', async () => {
    await transaction(async () => {
      // create two users
      foreman = await createUser('foreman', {})
      subordinate = await createUser('subordinate', {foreman_id: foreman.id})

      // checks
      foreman = await repository.findOneOrFail(foreman.id, {
        relations: ['subordinates']
      })
      subordinate = await repository.findOneOrFail(subordinate.id, {
        relations: ['foreman']
      })
      expect(foreman.subordinates[0].id).toBe(subordinate.id)
      expect(foreman.rank).toBe(2)
      expect(subordinate.foreman.id).toBe(foreman.id)
      expect(subordinate.rank).toBe(1)
    })
  })
})
