import container from "@/di/container"
import {getManager, getRepository} from "typeorm"
import {User} from "@entity/user/User.entity"
import {VK} from "vk-io";
import meet from "@/vk/meet";
import {basename} from "path";
import userFactory from "@entity/user/userFactory";
import createChat from "@/vk/utils/createChat";
import getChatInviteLink from "@/vk/utils/getChatInviteLink";

describe('getChatInviteLink', () => {
  let vk: VK,
    VK_TEST_USER = parseInt(process.env.VK_TEST_USER)

  beforeAll(async () => {
    vk = container.vk
  })

  it('success', async () => {
    const result= await createChat(basename(__filename), [userFactory(basename(__filename), {mid: VK_TEST_USER})])
    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('inviteLink')
  })
})

