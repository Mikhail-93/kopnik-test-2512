import {User} from "@entity/user/User.entity";

export default function (user: User, options: { isCurrentUser?: boolean, isForeman?: boolean, isSubordinate?: boolean, isWitness?: boolean, isSubordinateRequest?: boolean } = {}) {
  const result = {
    id: user.id,
    locale: user.locale,
    firstName: user.firstName,
    lastName: user.lastName,
    patronymic: user.patronymic,
    photo: user.photo,
    location: {lat: user.latitude, lng: user.longitude},
    birthYear: user.birthYear,
    isWitness: user.isWitness,
    status: user.status,
    rank: user.rank,

    passport: user.passport,
    witness_id: user.witness?.id || null,
    foremanRequest_id: user.foremanRequest?.id || null,
    foreman_id: user.foreman?.id || null,
    subordinates: user.subordinates?.map(eachSubordinate => eachSubordinate.id),
    foremanRequests: user.foremanRequests?.map(eachSubordinateRequest => eachSubordinateRequest.id),
    witnessRequests: user.witnessRequests?.map(eachWitnessRequest => eachWitnessRequest.id),

    witnessChatInviteLink: user.witnessChat?.inviteLink,
    foremanRequestChatInviteLink: user.foremanRequestChat?.inviteLink,
    tenChatInviteLink: user.tenChat?.inviteLink,
    mid: user.mid,
  }
  // passport
  if (!options.isCurrentUser && !options.isWitness) {
    delete result.passport
  }
  // witness
  if (!options.isCurrentUser && !options.isWitness) {
    delete result.witness_id
  }
  // foremanRequest
  if (!options.isCurrentUser && !options.isSubordinateRequest) {
    delete result.foremanRequest_id
    delete result.foremanRequestChatInviteLink
  }
  // foremanRequests
  if (!options.isCurrentUser) {
    delete result.foremanRequests
  }
  // witnessRequests
  if (!options.isCurrentUser) {
    delete result.witnessRequests
  }

  // witnessChatId? witnessChatInviteLink
  if (!options.isCurrentUser && !options.isWitness) {
    delete result.witnessChatInviteLink
  }

  //   tenChatId, tenChatInviteLink
  if (!options.isCurrentUser && !options.isSubordinate) {
    delete result.tenChatInviteLink
  }

  if (process.env.NODE_ENV !== 'test') {
    delete result.mid
  }

  return result
}
