import easyvk from 'easyvk'
import IVk from "@/di/vk/IVk";

export default interface IVKProvider {
  (): Promise<IVk>
}
