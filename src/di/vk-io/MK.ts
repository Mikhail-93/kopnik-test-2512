import {API, VK} from "vk-io";
import FriendStatusEnum from "@/di/vk-io/FriendStatusEnum";
import * as assert from "assert";

export default class {
  public api: API

  constructor(options) {
    this.api = {
      messages: {},
      friends: {},
      execute: null,
      users: {},
    } as API

    this.api.execute = async (code) => {
      return {response: 1, errors: []} as any
    }
    this.api.messages.send = async (params) => {
      assert.notEqual(params.peer_id, 2000000000, 'chat_id can\' be 2000000000')
      return 1
    }

    this.api.messages.createChat = async (params) => {
      return new Date().getTime()
    }
    this.api.messages.addChatUser = async (params) => {
      assert.ok(params.user_id)
      assert.ok(params.chat_id)
      return 1
    }
    this.api.messages.removeChatUser = async (params) => {
      assert.ok(params.user_id)
      assert.ok(params.chat_id)
      return 1
    }
    this.api.messages.getInviteLink = async (id) => {
      return {link: `https://vk.com/inviteLink?id=${id}`}
    }

    this.api.friends.areFriends = async (params) => {
      const userIds = (typeof params.user_ids == 'number') ? [params.user_ids] : params.user_ids

      return userIds.map(eachUserId => {
        return {
          user_id: eachUserId,
          friend_status: FriendStatusEnum.Friend
        }
      })
    }
    this.api.users.get = async (params) => {
      return [{
        first_name: 'test',
        last_name: 'test',
        nickname: 'test',
        photo_200: 'http://photo_200',
        domain: "test2test",
        id: new Date().getTime(),
      }]
    }

  }
}
