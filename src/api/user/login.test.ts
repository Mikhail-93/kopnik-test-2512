import app from "../../../../app";
import request from "supertest";
import {Status} from "op-client/dist";
import WPEx from "@op/entity/WPEx/WPEx";
import {Type} from "op-client/dist";
import {Project} from "op-client/dist";
import {CO} from "op-client/dist";
import DifficultyEnum from "@op/DifficultyEnum";
import {Duration} from "op-client/dist";
import container from "@/di/config";

describe('webhook any wp-ex close', () => {
  const em= container.em;
  let wp: WPEx

  beforeEach(async () => {
    wp= new WPEx()
    wp.body.subject= 'take test'
    wp.type=new Type(10)

    wp.status = new Status(1)
    wp.project = new Project(14);
    wp.module= new CO(2)
    wp.difficulty= new CO(DifficultyEnum.Высокая)
    wp.estimatedTime= new Duration({hours:30})
    await em.create<WPEx>(wp)
  })

  // https://urz.open.ru:8091/projects/gzt/work_packages/128

  it('Не закрыта', async () => {
    const res = await request(app)
      .post('/api/webhook')
      .send({
        action: "work_package:updated",
        work_package: wp.body,
      })
    expect(res.status).toEqual(200)
    expect(res.body).toEqual({})
  })

  it('Ранее закрыта', async () => {
    wp.status=new Status(12);
    wp.endDate = new Date(2020,1,1)
    const res = await request(app)
      .post('/api/webhook')
      .send({
        action: "work_package:updated",
        work_package: wp.body,
      })
    expect(res.status).toEqual(200)
    expect(res.body).toMatchObject({})
  })

  it('ОК', async () => {
    wp.status=new Status(12);
    const res = await request(app)
      .post('/api/webhook')
      .send({
        action: "work_package:updated",
        work_package: wp.body,
      })
    expect(res.status).toEqual(200)
    expect(res.body).toMatchObject({'closed.ts':'ok'})
  })
})
