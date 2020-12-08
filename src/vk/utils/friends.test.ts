import container from "@/di/container"
import {API, VK} from "vk-io";
import userFactory from "@entity/user/userFactory";
import createChat from "@/vk/utils/createChat";
import Chat from "@entity/Chat.entity";
import friends from "@/vk/utils/friends";
import FriendStatusEnum from "@/di/vk-io/FriendStatusEnum";
import {FriendsAreFriendsParams} from "vk-io/lib/api/schemas/params";
import * as Responses from "vk-io/lib/api/schemas/responses";
import {FriendsAreFriendsResponse} from "vk-io/lib/api/schemas/responses";

describe('friends', () => {
  let vk: VK,
    VK_TEST_USER = parseInt(process.env.VK_TEST_USER),
    areFriendsOriginal: API["friends"]['areFriends']

  beforeAll(async () => {
    await container.provideDatabase()
    vk = container.vk
    areFriendsOriginal = vk.api.friends.areFriends
  })

  beforeEach(async () => {
    vk.api.friends.areFriends = areFriendsOriginal
  })

  it('wait NotFriend', async () => {
    vk.api.friends.areFriends = jest.fn(async function (params) {
      return [{user_id: params.user_ids[0], friend_status: FriendStatusEnum.NotFriend}]
    } as API["friends"]['areFriends']) as any
    const user1 = userFactory('NotFriend')

    try {
      await friends([user1], {wait: true}, async () => { })
      throw new Error('should not be hire')
    }
    catch(err){
      expect(err.message).toContain('NotFriend')
      expect((vk.api.friends.areFriends as any).mock.calls.length).toBe(1)
    }
  })

  it('not wait NotFriend', async () => {
    vk.api.friends.areFriends = jest.fn(async function (params) {
      return [{user_id: params.user_ids[0], friend_status: FriendStatusEnum.NotFriend}]
    } as API["friends"]['areFriends']) as any
    const user1 = userFactory('NotFriend')

    await friends([user1], {wait: false}, async friendStatuses => {
      expect(friendStatuses[0].user === user1)
      expect(friendStatuses[0].friend_status === FriendStatusEnum.NotFriend)
      expect((vk.api.friends.areFriends as any).mock.calls.length).toBe(1)
    })
  })

  /**
   * Один раз ВК возвращает что в ожидании заявки,
   * второй раз что друг
   * Регулируется переменной iteration
   */
  it('wait HeSendRequest', async () => {
    let iteration = 0
    vk.api.friends.areFriends = jest.fn(async function (params) {
          return [{user_id: params.user_ids[0], friend_status: iteration++?FriendStatusEnum.Friend: FriendStatusEnum.HeSendRequest}]
    } as API["friends"]['areFriends']) as any
    const user1 = userFactory('HeSendRequest')

    await friends([user1], {wait: true}, async friendStatuses => {
      expect(friendStatuses[0].user === user1)
      expect(friendStatuses[0].friend_status === FriendStatusEnum.Friend)
      expect((vk.api.friends.areFriends as any).mock.calls.length).toBe(2)
    })
  })
})

