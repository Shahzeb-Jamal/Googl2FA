// db.js
const mysql = require("mysql2");

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "sept22",
  database: "usersdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function to get a user by username from the database
function getUser(username, password) {
  return new Promise((resolve, reject) => {
    try {
      pool.getConnection((error, connection) => {
        if (error) {
          reject(error);
        } else {
          connection.query(
            "SELECT * FROM users WHERE username = ? AND password = ?",
            [username, password],
            (error, results) => {
              connection.release(); // Release the connection

              if (error) {
                reject(error);
              } else {
                resolve(results[0]);
              }
            }
          );
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function checkUserExistsInDatabase(username) {
  return new Promise((resolve, reject) => {
    try {
      pool.getConnection((error, connection) => {
        if (error) {
          reject(error);
        } else {
          connection.query(
            "SELECT COUNT(*) FROM users WHERE username = ?",
            [username],
            (error, results) => {
              connection.release(); // Release the connection

              if (error) {
                reject(error);
              } else {
                const user_exists = results[0]["COUNT(*)"] === 0 ? false : true ;
                resolve(user_exists);
              }
            }
          );
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}


function getSecretKey(username) {
  return new Promise((resolve, reject) => {
    try {
      pool.getConnection((error, connection) => {
        if (error) {
          reject(error);
        } else {
          connection.query(
            `SELECT SecretKey FROM users WHERE username = ?`,
            [username],
            (error, results) => {
              connection.release(); // Release the connection

              if (error) {
                reject(error);
              } else {
                resolve(results[0].SecretKey);
              }
            }
          );
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  getUser,checkUserExistsInDatabase,getSecretKey
};
