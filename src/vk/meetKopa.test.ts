import container from "@/di/container"
import {VK} from "vk-io";
import {basename} from "path";
import testUser from "@entity/user/test-utils/testUser";
import meetKopa from "@/vk/meetKopa";
import konaz from "@entity/user/konaz";

describe('meetKopa', () => {
  let vk: VK,
    VK_TEST_USER = parseInt(process.env.VK_TEST_USER)

  beforeAll(async () => {
    // await container.provideDatabase()
    vk = container.vk
  })

  it('success', async () => {
    await meetKopa(basename(__filename), [testUser(), konaz()], )
  })
})
