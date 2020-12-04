import {interfaces} from "inversify";
import bunyantcp from 'bunyan-logstash-tcp'
import Logger, {LoggerOptions} from "bunyan";
import TYPES from "@/di/TYPES";
import {resolve} from "path";
import httpContext from 'express-cls-hooked'
import container from "@/di/container";
import _ from 'lodash'

container.bind<interfaces.Factory<Logger>>(TYPES.createLogger).toFactory((context) => {
  return (options = {}) => {
    function reqSerializer(req) {
      return {
        method: req.method,
        url: req.url,
        headers: req.headers
      };
    }
    const log = Logger.createLogger({
      name: 'myapp',
      serializers: {
        req: reqSerializer
      }
    });
    return log




    const defaultOptions: LoggerOptions = {
      name: "main",
      streams: [
        /*      заменил на консоль лог
                {
                  level: "debug",
                  stream: process.stdout            // log INFO and above to stdout
                },*/
      ],
      serializers: {
        ...Logger.stdSerializers,
        body() {
          return {}
        },
        req() {
          return {}
        },
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
        defaultOptions.serializers = {
          ...defaultOptions.serializers,
          req() {
            return {}
          },
          body() {
            return {}
          },
        }
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
        // if (process.env.NODE_ENV==='test'){
        console[level](this.fields.name, params)
        // }
        const req_id = httpContext.get('req_id')
        const wp = httpContext.get('wp')
        try {
          if (req_id) {
            this.fields.req_id = req_id
          }
          if (wp){
            this.fields.wp_id=wp.id
          }
          // @ts-ignore
          return super[level](...params)
        } finally {
          delete this.fields.req_id
          delete this.fields.wp_id
        }
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
});
