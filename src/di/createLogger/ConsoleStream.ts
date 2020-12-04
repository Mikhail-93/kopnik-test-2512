export default class ConsoleStream {
  write(rec) {
    // https://stackoverflow.com/a/41407246
    if (rec.err){
      console.log('\x1b[33m%s\x1b[0m', rec.name, "\x1b[0m", rec.err.stack,)
    }
    else {
      console.log('\x1b[33m%s\x1b[0m', rec.name, "\x1b[0m", rec.msg,)
    }
  }
}
