<template>
  <div class="alert-box_parent">
    <div class="alert-box">
      <div class="alert-box_header"></div>
      <div class="alert-box_messages">
        <div class="alert-message_yellow">
          <div class="icon-box">
            <img
              src="../../../../public/img/icon/control/WARNSCHILD_GELB_storage.png"
              alt="warn_storage"
            />
          </div>
          <div class="message-box">
            <div class="warning"><span>WARNING</span></div>
            <div class="main-message"><span>LOW STORAGE SPACE</span></div>
            <div class="val-message">200 GB</div>
          </div>
        </div>
        <div class="alert-message_yellow">
          <div class="icon-box">
            <img
              src="../../../../public/img/icon/control/WARNSCHILD_GELB_cpu.png"
              alt="warn_storage"
            />
          </div>
          <div class="message-box">
            <div class="warning"><span>WARNING</span></div>
            <div class="main-message"><span>CPU USAGE</span></div>
            <div class="val-message"><span> > 80%</span></div>
          </div>
        </div>
        <div class="alert-message_red">
          <div class="icon-box">
            <img
              src="../../../../public/img/icon/control/red_warning_cpu.png"
              alt="warn_storage"
            />
          </div>
          <div class="message-box">
            <div class="warning"><span>CRITICAL WARNING</span></div>
            <div class="main-message"><span>CPU USAGE</span></div>
            <div class="val-message"><span> > 90%</span></div>
          </div>
        </div>
        <div class="alert-message_red">
          <div class="icon-box">
            <img
              src="../../../../public/img/icon/control/key-rot.png"
              alt="warn_storage"
            />
          </div>
          <div class="message-box">
            <div class="warning"><span>CRITICAL WARNING</span></div>
            <div class="main-message"><span>MISSED ATTESTATION</span></div>
          </div>
        </div>
        <div class="alert-message_green">
          <div class="icon-box">
            <img
              src="../../../../public/img/icon/control/logo-icon.png"
              alt="warn_storage"
            />
          </div>
          <div class="message-box">
            <div class="warning"><span>NOTIFICATION</span></div>
            <div class="main-message"><span>STEREUM UPDATE</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
.alert-box_parent {
  width: 90%;
  height: 99%;
  margin-left: 3px;
  border: 5px solid rgb(55, 55, 55);
  border-radius: 20px;
  background-color: #464a44;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
.alert-box {
  display: flex;
  width: 95%;
  height: 95%;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
}
.alert-box_header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  height: 12%;
  background: #23272a;
  border: 1px solid #707070;
  border-radius: 5px;
  box-shadow: 1px 1px 5px 1px rgb(0, 23, 23);
}
.alert-box_messages {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 90%;
  height: 85%;
  background: #23272a;
  border: 1px solid #707070;
  border-radius: 5px;
  box-shadow: 1px 1px 5px 1px rgb(0, 23, 23);
  flex-direction: column;
}
.alert-message_yellow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  height: 12%;
  background: #ffd924;
  border: 1px solid #707070;
  border-radius: 5px;
  margin: 2px 0;
}
.alert-message_red {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  height: 12%;
  background: #be3635;
  border: 1px solid #707070;
  border-radius: 5px;
  margin: 2px 0;
  color: #eee;
}
.alert-message_green {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  height: 12%;
  background: #5f7e6a;
  border: 1px solid #707070;
  border-radius: 5px;
  margin: 2px 0;
  color: #eee;
}
.icon-box {
  width: 25%;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-box img {
  width: 95%;
  height: 99%;
}
.message-box {
  width: 70%;
  height: 75%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
}
.warning {
  display: flex;
  width: 80%;
  height: 10%;
  font-size: 10%;
  justify-content: flex-start;
  align-items: center;
  font-weight: 500;
}
.main-message {
  display: flex;
  width: 95%;
  height: 50%;
  justify-content: flex-start;
  align-items: center;
  font-size: 40%;
  font-weight: 800;
}
.val-message {
  display: flex;
  width: 95%;
  height: 35%;
  justify-content: flex-start;
  align-items: center;
  font-size: 45%;
  font-weight: 800;
}
</style>
