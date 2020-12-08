import {API, VK} from "vk-io";
import FriendStatusEnum from "@/di/vk-io/FriendStatusEnum";
import * as assert from "assert";

export default class {
  public api: API

  constructor(options) {
    this.api = {
      messages: {},
      friends: {}
    } as API

    this.api.messages.send = async (params) => {
      return 1
    }

    this.api.messages.createChat = async (params) => {
      return new Date().getTime()
    }
    this.api.messages.addChatUser= async (params) => {
      assert.ok(params.user_id)
      assert.ok(params.chat_id)
      return 1
    }
    this.api.messages.removeChatUser= async (params) => {
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

  }
}
