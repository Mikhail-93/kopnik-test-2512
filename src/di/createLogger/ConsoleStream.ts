import Logger, {LoggerOptions} from "bunyan";


export default class ConsoleStream {
  write(rec) {
    // https://stackoverflow.com/a/41407246
    if (rec.err) {
      console.log('\x1b[33m%s\x1b[0m', rec.name, "\x1b[0m", rec.err.stack,)
    } else {
      // почему-то не заменяет селекты после первого
      // const msg = rec.msg.startsWith('SELECT') ? rec.msg.replaceAll(/^SELECT([^]+?)FROM/g, 'SELECT ... \nFROM') : rec.msg
      const msg = rec.msg.startsWith('SELECT') ? rec.msg.substr(0, 50) : rec.msg
      console.log('\x1b[33m%s\x1b[0m', rec.name, "\x1b[36m", '[' + Logger.nameFromLevel[rec.level] + ']', "\x1b[0m", msg,)
    }
  }
}
