import container from "@/di/container"
import {VK} from "vk-io";
import {basename} from "path";
import userFactory from "@entity/user/userFactory";
import createChat from "@/vk/utils/createChat";
import Chat from "@entity/Chat.entity";

describe('createChat', () => {
  let vk: VK,
    VK_TEST_USER = parseInt(process.env.VK_TEST_USER)

  beforeAll(async () => {
    await container.provideDatabase()
    vk = container.vk
  })

  it('success', async () => {
    const result = await createChat(basename(__filename),
      [userFactory(basename(__filename), {mid: VK_TEST_USER})],
    )
    expect(result).toBeInstanceOf(Chat)
    expect(result.id).toBeTruthy()
    expect(result.inviteLink).toBeTruthy()
  })
})

