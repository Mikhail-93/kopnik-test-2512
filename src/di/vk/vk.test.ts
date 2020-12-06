import container from "@/di/container"
import {getManager, getRepository} from "typeorm"
import {User} from "@entity/user/User.entity"
import userFactory from "@entity/user/userFactory";
import IVk from "@/di/vk/IVk";
import easyvk from 'easyvk'
import {VK} from "vk-io";
import TYPES from "@/di/TYPES";

describe('vk', () => {
  let vk: IVk
  beforeEach(async () => {
    vk = await container.provideVk()
  })

  it('messages.send', async () => {
    const result= await vk.call('messages.send', {
      peer_id: process.env.VK_TEST_USER,
      message: 'Привет!',
      random_id: easyvk.randomId()
    })
    expect(result.valueOf()).toBeTruthy()
  })
  it.only('messages.createChat', async () => {
    const result = await vk.call('messages.createChat', {
      user_ids: `${process.env.VK_TEST_USER}`,
      title: 'vk.test.ts',
    })
    expect(result.valueOf()).toBeTruthy()
  })

  // https://vk.com/dev/friends.areFriends
  it('friends.areFriends', async () => {
    const result = await vk.call('friends.areFriends', {
      user_ids: `${process.env.VK_TEST_USER},${process.env.VK_TEST_USER+1}`,
      need_sign: 0,
    })
    expect(result[0]).toHaveProperty('friend_status')
  })
})

