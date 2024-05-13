export class AuthenticationService {
  constructor(nodeConnection){
    this.nodeConnection = nodeConnection;
    this.authStream = null;
    this.timeBased = null;
    this.increaseTimeLimit = false;
    this.enableRateLimit = true;
  }

  async beginAuthSetup(timeBased, increaseTimeLimit, enableRateLimit, win){
    this.timeBased = timeBased;
    this.increaseTimeLimit = increaseTimeLimit;
    this.enableRateLimit = enableRateLimit;
    let outputString;
    let sendKey = false;
    let validCode = false;

    await this.nodeConnection.sshService.exec("apt update")
    await this.nodeConnection.sshService.exec("apt install libqrencode-dev -y")
    await this.nodeConnection.sshService.exec("apt install libtool -y")
    await this.nodeConnection.sshService.exec("apt install libpam-dev -y")
    await this.nodeConnection.sshService.exec("apt install autoconf -y")
    await this.nodeConnection.sshService.exec("apt install make -y")
    await this.nodeConnection.sshService.exec("cd /root && git clone https://github.com/google/google-authenticator-libpam.git")
    await this.nodeConnection.sshService.exec("cd /root/google-authenticator-libpam && ./bootstrap.sh")
    await this.nodeConnection.sshService.exec("cd /root/google-authenticator-libpam && ./configure --libdir=/lib/x86_64-linux-gnu")
    await this.nodeConnection.sshService.exec("cd /root/google-authenticator-libpam && make && make install")

    const conn = this.nodeConnection.sshService.getConnectionFromPool();
    conn.shell((err, stream)=>{
      if(err) throw err;
      this.authStream = stream;
      stream.on('close', () => {
        console.log('Stream :: close');
      })
    
    this.authStream.write('google-authenticator\n');
    if(timeBased){
      this.authStream.write('y\n');
    }
    else{
      this.authStream.write('n\n');
    }
    this.authStream.stdout.on('data', (data) => {
      console.log(data.toString())
      outputString += data.toString();

      if(timeBased && outputString.includes("secret key") && !sendKey){
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

      if(timeBased && outputString.includes("Do you want me to update") && !validCode){
        validCode = true;
        console.log(outputString)
        outputString = outputString.replaceAll(/\r/gm, "");
        outputString = outputString.trim().split("\n");
        
        let outputArray = [];
      
        let scratchCodeIndex = outputString.findIndex(function(item){
          return item.indexOf("scratch")!==-1;
        })
        outputArray.push("skip")
        outputArray.push("skip")
        outputArray.push("skip")
        outputArray.push(outputString[scratchCodeIndex])
        for(let i = 1; i <= 5; i++){
          outputArray.push(outputString[scratchCodeIndex+i])
        }

        win.send("2FAEvents", outputArray);
      }
      

      if(!timeBased && outputString.includes("Do you want me to update") && !validCode){
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
    this.authStream.write(verificationCode + '\n');
  }

  async finishAuthSetup(){
      this.authStream.write('y\n');
      if(this.timeBased){
        this.authStream.write('n\n');
      }
      if(this.increaseTimeLimit){
        this.authStream.write('y\n');
      }
      else{
        this.authStream.write('n\n');
      }
      if(this.enableRateLimit){
        this.authStream.write('y\n');
      }
      else{
        this.authStream.write('n\n');
      }

     await this.nodeConnection.sshService.exec(`sed -i 's/^KbdInteractiveAuthentication[ ]no$/KbdInteractiveAuthentication yes/g' /etc/ssh/sshd_config`);
      await this.nodeConnection.sshService.exec(`echo "AuthenticationMethods publickey,password publickey,keyboard-interactive" >> /etc/ssh/sshd_config`);
      await this.nodeConnection.sshService.exec(`echo 'auth required pam_google_authenticator.so grace_period=43200' >> /etc/pam.d/sshd`);
      await this.nodeConnection.sshService.exec(`sed -i '/^@include common-auth$/s/^/#/' /etc/pam.d/sshd`);
      await this.nodeConnection.sshService.exec("systemctl restart sshd.service");
      this.authStream.end();
  }

  async removeAuthenticator(){
    await this.nodeConnection.sshService.exec(`sed -i '/AuthenticationMethods publickey,password publickey,keyboard-interactive/d' /etc/ssh/sshd_config`);
    await this.nodeConnection.sshService.exec(`sed -i '/auth required pam_google_authenticator.so grace_period=86400/d' /etc/pam.d/sshd`);
    await this.nodeConnection.sshService.exec("rm ~/.google_authenticator", true, false);
    await this.nodeConnection.sshService.exec("cd /root && rm -rf google-authenticator-libpam");
    await this.nodeConnection.sshService.exec("apt remove libtool -y");
    await this.nodeConnection.sshService.exec("apt remove libpam-dev -y");
    await this.nodeConnection.sshService.exec("apt remove autoconf -y");
    await this.nodeConnection.sshService.exec("apt remove make -y");
    await this.nodeConnection.sshService.exec("systemctl restart sshd.service");
  }

  async checkForAuthenticator(){
    let result = await this.nodeConnection.sshService.exec(`test -a ~/.google_authenticator`, true, false);
    if(result.rc == 0){
      return true;
    }
    else{
      return false;
    }
  }
}