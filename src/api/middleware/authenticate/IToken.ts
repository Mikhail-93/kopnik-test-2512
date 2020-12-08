export default interface IToken{
  expire: number,
  mid: number,
  secret: "OAuth",
  sid: string,
  sig: string,
}
