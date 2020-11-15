import container from "@/di/config";
import {Connection, getRepository} from "typeorm";
import {User} from "@entity/user/User";

describe('api/users', () => {
  beforeEach(async () => {
    await container.dbProvider()
  })

  it('login', async () => {
    await getRepository(User).findOneOrFail({id:1})
  })
})
