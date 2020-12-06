import container from "@/di/container"
import {getManager, getRepository} from "typeorm"
import {User} from "@entity/user/User.entity"
import userFactory from "@entity/user/userFactory";
import IVk from "@/di/vk/IVk";
import easyvk from 'easyvk'
import {VK} from "vk-io";
import TYPES from "@/di/TYPES";
import _ from 'lodash'

describe('vk', () => {
  let vk: VK,
    VK_TEST_USER= parseInt(process.env.VK_TEST_USER)

  beforeEach(async () => {
    vk = container.get<VK>(TYPES.vkIo)
  })

  // https://vk.com/dev/messages.send
  it('messages.send', async () => {
    const result= await vk.api.messages.send({
      peer_id: parseInt(process.env.VK_TEST_USER),
      message: 'vk-io',
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
  it.only('friends.areFriends', async () => {
    const result = await vk.api.friends.areFriends({
      user_ids: [VK_TEST_USER, VK_TEST_USER+1],
      need_sign: 0,
    })
    expect(result[0]).toHaveProperty('friend_status')
  })


})

