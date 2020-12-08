import container from "@/di/container"
import {VK} from "vk-io";
import meet from "@/vk/meet";
import {basename} from "path";
import testUser from "@entity/user/test-utils/testUser";
import createChat from "@/vk/utils/createChat";
import Chat from "@entity/Chat.entity";

describe('meet', () => {
  let vk: VK,
    VK_TEST_USER = parseInt(process.env.VK_TEST_USER)

  beforeAll(async () => {
    await container.provideDatabase()
    vk = container.vk
  })

  it('success to new chat', async () => {
    const result = await meet(basename(__filename), [testUser()], {messages: [{message: 'hello!'}]})
    expect(result).toBeInstanceOf(Chat)
  })
  it('success to old chat', async () => {
    const chat = await createChat(basename(__filename), [testUser()])
    const result = await meet(basename(__filename), [testUser()], {chat, messages: [{message: 'hello!'}]})
    expect(result).toBeUndefined()
  })

})

