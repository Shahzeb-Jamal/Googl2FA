const mysql = require('mysql2/promise');

class CaptchaPersistence {
  constructor() {
    this.connection = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: 'sept22',
      database: 'usersd', // Replace 'nodeuserdb' with the name of your database
    });
  }

  async AddCaptcha(captchaInfo) {
    try {
      const connection = await this.connection.getConnection();
      const query =
        'INSERT INTO Captchas (EncryptedCaptcha, ExpirationTime) VALUES (?, ?)';
      await connection.execute(query, [captchaInfo.EncryptedCaptcha, captchaInfo.ExpirationTime]);
      connection.release();
    } catch (error) {
      console.error('Error adding captcha:', error);
    }
  }
}

module.exports = new CaptchaPersistence();