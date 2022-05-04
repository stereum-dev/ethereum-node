const log = require('electron-log')

export class StringUtils {
  static escapeStringForShell (shellCmd) {
    log.debug('received: ', shellCmd)

    let escapedShellCmd = ''
    if (shellCmd) {
      escapedShellCmd = '"' + shellCmd.replace(/(["'$`\\])/g, '\\$1') + '"'
    }

    log.debug('escaped: ', escapedShellCmd)

    return escapedShellCmd
  }

  static createRandomString () {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 36; i++) {
      if (i == 8 || i == 13 || i == 18 || i == 23) {
        result += '-'
      } else {
        result += characters.charAt(Math.random() * characters.length)
      }
    }
    return result
  }
}
