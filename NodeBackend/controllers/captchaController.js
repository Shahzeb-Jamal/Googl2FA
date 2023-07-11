const { createCanvas, loadImage } = require('canvas');
const crypto = require('crypto');
const CaptchaPersistence = require('../models/captchaPersistence');
const CaptchaInfo = require('./CaptchaInfo');
const CaptchaGenerationResponse = require('./CaptchaGenerationResponse');


const CaptchaLength = 6;
const CaptchaExpirationMinutes = 10;

const GenerateCaptcha = async (req, res) => {
  const captchaText = GenerateRandomString(CaptchaLength);
  const encryptedCaptcha = EncryptString(captchaText);
  const captchaImage = await GenerateCaptchaImage(captchaText);

  const captchaInfo = new CaptchaInfo({
    EncryptedCaptcha: encryptedCaptcha,
    ExpirationTime: new Date(Date.now() + CaptchaExpirationMinutes * 60000),
  });

  CaptchaPersistence.AddCaptcha(captchaInfo);

  const base64Image = captchaImage.toString('base64');

  res.status(200).json(
    new CaptchaGenerationResponse({
      CaptchaImage: base64Image,
    })
  );
};

const GenerateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

const EncryptString = (text) => {
  const cipher = crypto.createCipher('aes-256-cbc', 'YourEncryptionKey');
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

function generateCaptchaImage(text) {
    const canvas = createCanvas(150, 50);
    const context = canvas.getContext('2d');
  
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
  
    context.font = '30px sans-serif'; // Use the default system font
    context.fillStyle = '#000000';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
  
    return canvas;
  }
  

module.exports = {
  GenerateCaptcha,
};
