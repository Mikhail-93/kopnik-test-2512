import container from "@/di/container"
import {VK} from "vk-io";
import meetWitness from "@/vk/meetWitness";
import testUser from "@entity/user/testUser";
import Chat from "@entity/Chat.entity";

describe('meetWitness', () => {
  let vk: VK,
    VK_TEST_USER = parseInt(process.env.VK_TEST_USER)

  beforeAll(async () => {
    await container.provideDatabase()
    vk = container.vk
  })

  it('success to new chat', async () => {
    const result = await meetWitness(testUser({witness_id: VK_TEST_USER}))
    expect(result).toBeInstanceOf(Chat)
  })
})

