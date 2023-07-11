class CaptchaInfo {
    constructor(data) {
      this.EncryptedCaptcha = data.EncryptedCaptcha;
      this.ExpirationTime = data.ExpirationTime;
    }
  }
  
  module.exports = CaptchaInfo;
  