const mysql = require('mysql');
const { dbConfig } = require('../config');

const pool = mysql.createPool(dbConfig);

var db = {};

db.q = function(sql, params) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function(err, connnection) {
      if(err) {
        reject(err);
        return;
      }

      connnection.query(sql, params, function (error, results, fields) {
        console.log(`${sql}=>${params}`);
        
        connnection.release();
        if(error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  });
}

module.exports = db;