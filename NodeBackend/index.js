const express = require('express');
const mysql = require('mysql2/promise');
const { createCanvas } = require('canvas');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const db = require("./db");
const jwtUtils = require("./jwtUtils");
const qrcode = require('qrcode');
const base64Img = require('base64-img');
const speakeasy = require('speakeasy');
const tokenUtils = require('./tokenUtils');
const cors = require('cors')


// Other configurations and middleware can go here
const app = express();
// Middleware for parsing JSON data
app.use(bodyParser.json());
app.use(cors());


app.get('/api/captcha/GetCaptcha', async (req, res) => {
  const captchaLength = 6;
  const captchaExpirationMinutes = 10;

  try {
    const captchaText = generateRandomString(captchaLength);
    const encryptedCaptcha = encryptString(captchaText);
    const captchaImage = generateCaptchaImage(captchaText);

    const captchaInfo = {
      EncryptedCaptcha: encryptedCaptcha,
      ExpirationTime: new Date(Date.now() + captchaExpirationMinutes * 60000),
    };

    await addCaptcha(captchaInfo);

    const base64Image = captchaImage.toDataURL();
    console.log(base64Image);
    const imageData = base64Image.replace(/^data:image\/png;base64,/, '');

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ captchaImage: imageData });
  } catch (error) {
    console.error('Error generating captcha:', error);
    res.status(500).json({ error: 'Error generating captcha' });
  }
});

// Validate Captcha endpoint
app.post('/api/captcha/ValidateCaptcha', async (req, res) => {
  const { captcha } = req.body;

  try {
    const encryptedCaptcha = encryptString(captcha);

    const captchaInfo = await retrieveCaptcha(encryptedCaptcha);
    if (captchaInfo) {
      if (captchaInfo.ExpirationTime < new Date()) {
        return res.status(400).json({ error: 'Captcha expired' });
      }

      if (encryptedCaptcha === captchaInfo.EncryptedCaptcha) {
        await removeCaptcha(captchaInfo);
        return res.json({ isValid: true, message: 'Captcha validation successful' });
        console.log("captcha validation successful");
      }
    }

    return res.status(400).json({ error: 'Invalid captcha' });
  } catch (error) {
    console.error('Error validating captcha:', error);
    res.status(500).json({ error: 'Error validating captcha' });
  }
});

const PORT = 3000; 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

async function addCaptcha(captchaInfo) {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sept22',
    database: 'usersdb',
  });

  const query = 'INSERT INTO Captchas (EncryptedCaptcha, ExpirationTime) VALUES (?, ?)';
  await connection.execute(query, [captchaInfo.EncryptedCaptcha, captchaInfo.ExpirationTime]);
  connection.end();
}

// Helper function to generate a random string for the captcha text
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Helper function to encrypt the captcha text
function encryptString(text) {
  const secretKey = 'YourSecretKey'; 
  const cipher = crypto.createCipher('aes-256-cbc', secretKey);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}



// Helper function to generate the captcha image
function generateCaptchaImage(text) {
  const canvas = createCanvas(150, 50);
  const context = canvas.getContext('2d');

  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.font = '30px Arial'; 
  context.fillStyle = '#000000';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  return canvas;
}

async function retrieveCaptcha(encryptedCaptcha) {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sept22',
    database: 'usersdb',
  });

  const query = 'SELECT * FROM Captchas WHERE EncryptedCaptcha = ?';
  const [rows] = await connection.execute(query, [encryptedCaptcha]);
  connection.end();

  return rows.length ? rows[0] : null;
}

async function removeCaptcha(captchaInfo) {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sept22',
    database: 'usersdb',
  });

  const query = 'DELETE FROM Captchas WHERE EncryptedCaptcha = ?';
  await connection.execute(query, [captchaInfo.EncryptedCaptcha]);
  connection.end();
}

app.use(express.json());

app.post("/api/Users/token", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    try {
      // Check if the username and password are valid in the database
      const user = await db.getUser(username, password);

      if (user && user.Password === password) {
        // Generate a JWT token
        const token = jwtUtils.generateToken(username);

        // Set the response Content-Type header to application/json
        res.setHeader("Content-Type", "application/json");

        // Return the JWT token
        res.json({ token });
        console.log(token);
      } else {
        // Return an error message
        res.status(401).json({ message: "Invalid username or password" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    // Handle any error that occurs within the try block
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/api/Users', async(req, res) => {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const decodedToken = tokenUtils.decodeToken(bearerToken);

  if (!decodedToken) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  try {
    const username = decodedToken.username;
    if(!await db.checkUserExistsInDatabase(username))
    {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
      const secret = await db.getSecretKey(username);
      const otpauthURL = speakeasy.otpauthURL({
        secret: secret,
        label: username,
        issuer: 'shahzebjamal@gmail.com',
      });
  
      qrcode.toDataURL(otpauthURL, (err, dataURL) => {
        if (err) {
          console.error('Error generating QR code:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
  
        base64Img.img(dataURL, '', 'qr_code', (err, filepath) => {
          if (err) {
            console.error('Error encoding QR code:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }
  
          const base64QRCode = base64Img.base64Sync(filepath);
          // Set the content type header
          res.setHeader('Content-Type', 'application/json');
          res.json({ qrCodeSetupImageUrl: base64QRCode });
        });
      });
  } catch (error) {
    console.error('Error in processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});  

app.post('/api/Users/Validate2FACode', async(req, res) => {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const decodedToken = tokenUtils.decodeToken(bearerToken);

  if (!decodedToken) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  try {
    const username = decodedToken.username;
    if(!await db.checkUserExistsInDatabase(username))
    {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    const secret = await db.getSecretKey(username);
      const verificationResult = speakeasy.totp.verify({
        secret: secret,
        token: req.body.Google2FACode,
      });
  console.log(verificationResult);
   // Set the content type header
   res.setHeader('Content-Type', 'application/json');
   res.json({ Success : verificationResult });
      
  } catch (error) {
    console.error('Error in processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





