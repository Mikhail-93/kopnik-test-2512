import {VK} from "vk-io";

export default class extends VK {
  constructor(options) {
    super(options)

    this.api.messages.send = async (params) => {
      return 1
    }
    this.api.messages.createChat = async (params) => {
      return (params.user_ids as number[]).reduce((acc, id)=>acc+id)
    }
    this.api.friends.areFriends = async (params) => {
      return [{friend_status: 3}] as any
    }
/*
    this.api = {
      messages: {
        async send(params) {
          return 1
        },
        async createChat(params) {
          return 1
        }
      },
      friends: {
        async areFriends(params) {
          return [{friend_status: 3}] as any
        }
      }
    } as any
    */
  }
}
