import * as QRCode from "qrcode";

export class AuthenticationService {
  constructor(nodeConnection) {
    this.nodeConnection = nodeConnection;
    this.authStream = null;
    this.timeBased = null;
    this.increaseTimeLimit = false;
    this.enableRateLimit = true;
  }

  async beginAuthSetup(timeBased, increaseTimeLimit, enableRateLimit, win) {
    this.timeBased = timeBased;
    this.increaseTimeLimit = increaseTimeLimit;
    this.enableRateLimit = enableRateLimit;
    let outputString;
    let sendKey = false;
    let validCode = false;

    // Setup Google Authenticator PAM module
    await this.nodeConnection.runPlaybook("2FA Setup", {
      stereum_role: "2fa-setup",
    });

    // Start 2FA user setup with google-authenticator
    const conn = this.nodeConnection.sshService.getConnectionFromPool();
    conn.shell((err, stream) => {
      if (err) throw err;
      this.authStream = stream;
      stream.on("close", () => {
        console.log("Stream :: close");
      });

      this.authStream.write("google-authenticator\n");
      if (timeBased) {
        this.authStream.write("y\n");
      } else {
        this.authStream.write("n\n");
      }
      this.authStream.stdout.on("data", (data) => {
        outputString += data.toString();

        if (timeBased && outputString.includes("secret key") && !sendKey) {
          sendKey = true;
          outputString = outputString.replaceAll(/\r/gm, "");
          outputString = outputString.trim().split("\n");

          let outputArray = [];

          outputArray.push(
            outputString[
            outputString.findIndex(function (item) {
              return item.indexOf("https") !== -1;
            })
            ]
          );
          outputArray.push(
            outputString[
            outputString.findIndex(function (item) {
              return item.indexOf("secret key") !== -1;
            })
            ]
          );
          win.send("2FAEvents", outputArray);
        }

        if (timeBased && outputString.includes("Do you want me to update") && !validCode) {
          validCode = true;

          outputString = outputString.replaceAll(/\r/gm, "");
          outputString = outputString.trim().split("\n");

          let outputArray = [];

          let scratchCodeIndex = outputString.findIndex(function (item) {
            return item.indexOf("scratch") !== -1;
          });
          outputArray.push("skip");
          outputArray.push("skip");
          outputArray.push("skip");
          outputArray.push(outputString[scratchCodeIndex]);
          for (let i = 1; i <= 5; i++) {
            outputArray.push(outputString[scratchCodeIndex + i]);
          }

          win.send("2FAEvents", outputArray);
        }

        if (!timeBased && outputString.includes("Do you want me to update") && !validCode) {
          validCode = true;

          outputString = outputString.replaceAll(/\r/gm, "");
          outputString = outputString.trim().split("\n");

          let outputArray = [];

          outputArray.push(
            outputString[
            outputString.findIndex(function (item) {
              return item.indexOf("https") !== -1;
            })
            ]
          );

          let secretKeyIndex = outputString.findIndex(function (item) {
            return item.indexOf("secret key") !== -1;
          });
          outputArray.push(outputString[secretKeyIndex]);
          for (let i = 1; i <= 7; i++) {
            outputArray.push(outputString[secretKeyIndex + i]);
          }

          win.send("2FAEvents", outputArray);
        }
      });
    });
  }

  async authenticatorVerification(verificationCode) {
    this.authStream.write(verificationCode + "\n");
  }

  async finishAuthSetup() {
    this.authStream.write("y\n");
    if (this.timeBased) {
      this.authStream.write("n\n");
    }
    if (this.increaseTimeLimit) {
      this.authStream.write("y\n");
    } else {
      this.authStream.write("n\n");
    }
    if (this.enableRateLimit) {
      this.authStream.write("y\n");
    } else {
      this.authStream.write("n\n");
    }
    // Enable 2FA configs and restart SSH server
    await this.nodeConnection.runPlaybook("Enable 2FA", {
      stereum_role: "2fa-enable",
    });
    this.authStream.end();
  }

  async removeAuthenticator() {
    let resultuser = await this.nodeConnection.sshService.exec(`whoami`, false);
    if (resultuser.rc == 0) {
      let user = resultuser.stdout.trim();
      let result = await this.nodeConnection.runPlaybook("Remove 2FA", {
        stereum_role: "2fa-remove",
        myuser: user,
      });
      console.log(result);
    }
  }

  async checkForAuthenticator() {
    let result = await this.nodeConnection.sshService.exec(`test -a ~/.google_authenticator`, false);
    if (result.rc == 0) {
      return true;
    } else {
      return false;
    }
  }

  async create2FAQRCode(type, name, ip, secret) {
    let otpauth = `otpauth://${type}/${ip}@${name}?secret=${secret}&issuer=${name}`;
    const url = await QRCode.toDataURL(otpauth)
    return url;
  }
}
