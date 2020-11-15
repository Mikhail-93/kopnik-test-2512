import {ConnectionOptions, createConnection, getRepository} from "typeorm/index";
import {Difficulty} from "@entity/Difficulty";
import container from "@/di/config";

describe('Difficulty', () => {
  describe('webhook gruppa-zalogovih-tehnologii podgotovka-biznes-trebovanii created', () => {
    beforeAll(async () => {
      await container.connectionProvider()
    })

    it('find', async () => {
      const entity = await getRepository(Difficulty).find({id: 1})
    })
  })
})
