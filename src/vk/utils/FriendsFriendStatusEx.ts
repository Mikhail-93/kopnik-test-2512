import {FriendsFriendStatus} from "vk-io/lib/api/schemas/objects";
import {User} from "@entity/user/User.entity";
import FriendStatusEnum from "@/di/vk-io/FriendStatusEnum";

export default interface FriendsFriendStatusEx extends FriendsFriendStatus {
  user?: User,
  friend_status: FriendStatusEnum,
}
