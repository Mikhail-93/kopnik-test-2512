import {interfaces} from "inversify";
import bunyantcp from 'bunyan-logstash-tcp'
import Logger, {LoggerOptions} from "bunyan";
import TYPES from "@/di/TYPES";
import {resolve} from "path";
import httpContext from 'express-cls-hooked'
import container from "@/di/container";
import _ from 'lodash'
import ConsoleStream from "@/di/createLogger/ConsoleStream";
import ContextStream from "@/di/createLogger/ContextStream";

container.bind<interfaces.Factory<Logger>>(TYPES.createLogger).toFactory((context) => {
  return (options = {}) => {
    const defaultOptions: LoggerOptions = {
      name: "main",
      streams: [
        {
          level: 'debug',
          type: "raw",
          stream: new ContextStream() as any
        },
        {
          level: 'debug',
          type: "raw",
          stream: new ConsoleStream() as any
        },
      ],
      serializers: {
        ...Logger.stdSerializers,
        msg(msg){
          return msg
        }
      },
      src: true
    }

    // в dev режиме сами отправляем логи в Логсташ
    switch (process.env.NODE_ENV) {
      case 'development':
        /*        (defaultOptions.streams as any).push({
                  level: 'debug',
                  type: "raw",
                  stream: bunyantcp.createStream({
                    host: 'urz.open.ru',
                    // port: 9998,
                    port: 9995,
                  })
                })*/
        break
      case 'test':
        break
      case 'production':
      case 'staging':
        (defaultOptions.streams as any).push({
          type: "rotating-file",
          path: resolve(__dirname, '../../logs', process.env.NODE_ENV + ".log"),
          period: "1d",   // daily rotation
          count: 100,        // keep 100 back copies
          level: "debug"
        })
        break
    }
    const loggerOptions = _.merge(defaultOptions, options)
    return new class CustomLogger extends Logger {
      log(level: 'debug' | 'warn' | 'info' | 'error', params: any[]) {
          // @ts-ignore
          return super[level](...params)
      }

      // @ts-ignore
      debug(...params): void {
        // @ts-ignore
        return this.log('debug', params)
      }

      // @ts-ignore
      info(...params): void {
        // @ts-ignore
        return this.log('info', params)
      }

      // @ts-ignore
      warn(...params): void {
        // @ts-ignore
        return this.log('warn', params)
      }

      // @ts-ignore
      error(...params): void {
        // @ts-ignore
        return this.log('error', params)
      }
    }(loggerOptions)
  }
})
