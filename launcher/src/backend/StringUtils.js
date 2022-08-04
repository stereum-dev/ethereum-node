const log = require('electron-log')
import * as crypto from 'crypto'

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
    //fallback if crypto breaks on us
    const randomString = crypto.randomBytes(18).toString('hex')
    let result = ''
    for (let i = 0; i < 36; i++) {
      if (i == 8 || i == 13 || i == 18 || i == 23) {
        result += '-'
      } else {
        result += randomString[i]
      }
    }
    return result
  }
}
