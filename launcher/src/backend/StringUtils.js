const log = require('electron-log');

export class StringUtils {
    static escapeStringForShell(shellCmd) {
        log.debug("received: ", shellCmd);

        let escapedShellCmd = "";
        if (shellCmd) {
            escapedShellCmd = '"' + shellCmd.replace(/(["'$`\\])/g,'\\$1') + '"';
        }

        log.debug("escaped: ", escapedShellCmd);

        return escapedShellCmd;
    }
}