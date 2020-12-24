import container from "@/di/container"
import {getManager, getRepository} from "typeorm"
import {User} from "@entity/user/User.entity"
import userFactory from "@entity/user/test-utils/testUserFactory";
import IVk from "@/di/vk-io/IVk";
import easyvk from 'easyvk'
import {VK} from "vk-io";
import TYPES from "@/di/TYPES";
import _ from 'lodash'
import {basename} from "path";

describe('vk', () => {
  let vk: VK,
    VK_TEST_USER = parseInt(process.env.VK_TEST_USER)

  beforeEach(async () => {
    // process.env.NODE_ENV = 'development'
    vk = container.get<VK>(TYPES.vkIo)
  })

  // https://vk.com/dev/messages.send
  it('messages.send', async () => {
    const result = await vk.api.messages.send({
      peer_id: parseInt(process.env.VK_TEST_USER),
      message: 'vk-io https://kopnik.org',
      random_id: _.random(1000000)
    })
    expect(result).toBeTruthy()
  })

  // https://vk.com/dev/messages.createChat
  it('messages.createChat', async () => {
    const result = await vk.api.messages.createChat({
      user_ids: [VK_TEST_USER, VK_TEST_USER + 1],
      title: 'vk-io.test.ts',
    })
    expect(result).toBeTruthy()
  })

  // https://vk.com/dev/friends.areFriends
  it('friends.areFriends', async () => {
    const result = await vk.api.friends.areFriends({
      user_ids: [VK_TEST_USER, VK_TEST_USER + 1],
      need_sign: 0,
    })
    expect(result[0]).toHaveProperty('friend_status')
  })

  // https://negezor.github.io/vk-io/ru/guide/api.html#%D0%BE%D0%B3%D1%80%D0%B0%D0%BD%D0%B8%D1%87%D0%B5%D0%BD%D0%B8%D1%8F-%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%BE%D0%B2
  it('limit message async', async () => {
    const result = await Promise.all([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => vk.api.messages.send({
      peer_id: parseInt(process.env.VK_TEST_USER),
      message: basename(__filename) + ' ' + i,
      random_id: _.random(1000000)
    })))

    console.log(result)
  })
  it('limit message sync', async () => {

    // container.()
    for (let i = 0; i < 10; i++) {
      const result = await vk.api.messages.send({
        peer_id: parseInt(process.env.VK_TEST_USER),
        message: basename(__filename) + ' ' + i,
        random_id: _.random(1000000)
      })
      console.log(result)
    }
  })
  it('execute', async () => {

    // container.()
    const result = await vk.api.execute({
      code: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => `
          API.messages.send({ "peer_id":${parseInt(process.env.VK_TEST_USER)}, message: "${basename(__filename)} ${i}", random_id: ${_.random(1000000)} }); `)
        .join(' ')
    })
    console.log(result)
  })
})

