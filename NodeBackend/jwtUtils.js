// jwtUtils.js
const jwt = require("jsonwebtoken");

function generateToken(username) {
  const token = jwt.sign({ username }, "secret", { expiresIn: 60 * 60 });
  return token;
}

module.exports = {
  generateToken,
};
