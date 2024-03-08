export class AuthenticationService {
  constructor(nodeConnection){
    this.nodeConnection = nodeConnection;
    this.authStream = null;
    this.isTimeBased = false;
  }

  async beginAuthSetup(timeBased, win){
    let outputString;
    let sendKey = false;
    let validCode = false;

    await this.nodeConnection.sshService.exec("apt-get update ; apt-get install libpam-google-authenticator")

    const conn = this.nodeConnection.sshService.getConnectionFromPool();
    conn.shell((err, stream)=>{
      if(err) throw err;
      this.authStream = stream;
      stream.on('close', () => {
        console.log('Stream :: close');
      })
    
    this.authStream.write('google-authenticator\n');
    this.isTimeBased = timeBased;
    if(timeBased){
      this.authStream.write('y\n');
    }
    else{
      this.authStream.write('n\n');
    }
    this.authStream.stdout.on('data', (data) => {
      //console.log("stout: " + data.toString())
      
      
      outputString += data.toString();

      if(this.timeBased && outputString.includes("secret key") && !sendKey){
        sendKey = true;
        outputString = outputString.replaceAll(/\r/gm, "");
        outputString = outputString.trim().split("\n");

        let outputArray = [];
        
        outputArray.push(outputString[outputString.findIndex(function(item){
          return item.indexOf("https")!==-1;
        })])
        outputArray.push(outputString[outputString.findIndex(function(item){
          return item.indexOf("secret key")!==-1;
        })])

        win.send("2FAEvents", outputArray);
      }

      if(outputString.includes("Do you want me to update") && !validCode){
        validCode = true;
        console.log(outputString)
        outputString = outputString.replaceAll(/\r/gm, "");
        outputString = outputString.trim().split("\n");
        
        let outputArray = [];
        
        outputArray.push(outputString[outputString.findIndex(function(item){
          return item.indexOf("https")!==-1;
        })])
        let secretKeyIndex = outputString.findIndex(function(item){
          return item.indexOf("secret key")!==-1;
        })
        outputArray.push(outputString[secretKeyIndex])
        for(let i = 1; i <= 7; i++){
          outputArray.push(outputString[secretKeyIndex+i])
        }

        win.send("2FAEvents", outputArray);
      }})
    });
  }

  async authenticatorVerification(verificationCode) {
    this.authStream.write(verificationCode + '\n');;
    let outputString = await this.nodeConnection.sshService.exec(verificationCode);
    if(outputString.includes("scretch")) {
      return outputString;
    }
    else{
      return "wrong code";
    }
  }

  async finishAuthSetup(increaseTimeLimit, enableRateLimit){
    this.authStream.write('y\n');
    if(increaseTimeLimit){
      this.authStream.write('y\n');
    }
    else{
      this.authStream.write('n\n');
    }
    if(enableRateLimit){
      this.authStream.write('y\n');
    }
    else{
      this.authStream.write('n\n');
    }

    await this.nodeConnection.sshService.exec("cp /etc/pam.d/sshd /etc/pam.d/sshd.bak");
    await this.nodeConnection.sshService.exec("cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak");

    await this.nodeConnection.sshService.exec(`echo "auth required pam_google_authenticator.so nullok" >> /etc/pam.d/sshd`);
    //await this.nodeConnection.sshService.exec(`echo "auth required pam_permit.so" >> /etc/pam.d/sshd`);
    //await this.nodeConnection.sshService.exec(`echo "echo 'auth required pam_google_authenticator.so grace_period=86400' >> /etc/pam.d/sshd"`);
    //await this.nodeConnection.sshService.exec(`echo "echo 'PasswordAuthentication no' >> /etc/ssh/sshd_config"`);
    await this.nodeConnection.sshService.exec(`sed -i -e 's/KbdInteractiveAuthentication no/KbdInteractiveAuthentication yes/g' /etc/ssh/sshd_config"`);
    await this.nodeConnection.sshService.exec(`echo "AuthenticationMethods publickey,password publickey,keyboard-interactive" >> /etc/ssh/sshd_config`);
    await this.nodeConnection.sshService.exec(`sed -i '/^@include common-auth$/s/^/#/' /etc/pam.d/sshd`);
    await this.nodeConnection.sshService.exec("systemctl restart sshd.service");
    this.authStream.end();
  }

  async removeAuthenticator(){
    await this.nodeConnection.sshService.exec("cp /etc/pam.d/sshd.bak /etc/pam.d/sshd");
    await this.nodeConnection.sshService.exec("cp /etc/ssh/sshd_config.bak /etc/ssh/sshd_config");
    await this.nodeConnection.sshService.exec("apt-get remove libpam-google-authenticator");
    await this.nodeConnection.sshService.exec("systemctl restart sshd.service");
  }
}