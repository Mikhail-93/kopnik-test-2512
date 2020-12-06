import easyvk from 'easyvk'

export default interface IVk {
  call(method: string, options: any): Promise<any>
}
