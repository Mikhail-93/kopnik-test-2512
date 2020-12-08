import container from "@/di/container"
import {getManager, getRepository} from "typeorm"
import {User} from "@entity/user/User.entity"
import userFactory from "@entity/user/test-utils/testUserFactory";
import IVk from "@/di/vk-io/IVk";
import easyvk from 'easyvk'
import {VK} from "vk-io";
import TYPES from "@/di/TYPES";
import _ from 'lodash'

describe.skip ('vk', () => {
  let vk: VK,
    VK_TEST_USER= parseInt(process.env.VK_TEST_USER)

  beforeEach(async () => {
    vk = container.get<VK>(TYPES.vkIo)
  })

  // https://vk.com/dev/messages.send
  it('messages.send', async () => {
    const result= await vk.api.messages.send({
      peer_id: parseInt(process.env.VK_TEST_USER),
      message: 'vk-io https://kopnik.org',
      random_id: _.random(1000000)
    })
    expect(result).toBeTruthy()
  })

  // https://vk.com/dev/messages.createChat
  it('messages.createChat', async () => {
    const result = await vk.api.messages.createChat({
      user_ids: [VK_TEST_USER, VK_TEST_USER+1],
      title: 'vk-io.test.ts',
    })
    expect(result).toBeTruthy()
  })

  // https://vk.com/dev/friends.areFriends
  it('friends.areFriends', async () => {
    const result = await vk.api.friends.areFriends({
      user_ids: [VK_TEST_USER, VK_TEST_USER+1],
      need_sign: 0,
    })
    expect(result[0]).toHaveProperty('friend_status')
  })
})

