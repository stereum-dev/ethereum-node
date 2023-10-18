const log = require("electron-log");

export class AnsibleUtils {
  static parsePlaybookOutput(output) {
    if (output) {
      const lines = output.split("\n");

      return lines
        .map((line) => {
          log.debug("line to parse: ", line);

          if (line) {
            const jsons = [];

            const firstJson = line.match("({.*}).*=>");
            const secondJson = line.match("=>.*({.*})");
            const allJson = line.match("({.*})");
            log.debug("firstJson: ", firstJson);
            log.debug("secondJson: ", secondJson);
            log.debug("allJson: ", allJson);

            if (firstJson && firstJson.length == 2) {
              jsons.push(JSON.parse(firstJson[1]));
            }
            if (secondJson && secondJson.length == 2) {
              jsons.push(JSON.parse(secondJson[1]));
            }
            if (jsons.length == 0 && allJson && allJson.length == 2) {
              jsons.push(JSON.parse(allJson[1]));
            }

            return jsons;
          } else {
            return null;
          }
        })
        .filter((e) => e && Array.isArray(e) && e.length > 0);
    }

    return [];
  }
}
