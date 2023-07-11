// tokenUtils.js

const jwt_decode = require('jwt-decode');
//import jwt_decode from "jwt-decode";


const secretKey = '';

//var decoded = jwt_decode(token);

function decodeToken(token) {
  try {
    return jwt_decode(token);
  } catch (error) {
    return null;
  }
}

module.exports = {
   decodeToken,
};
