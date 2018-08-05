const config = {
  "development": {
    "username": process.env.DB_USER || "admin", 
    "password": process.env.DB_PASSWORD || "admin", 
    "database": process.env.DB_NAME || "contactsdb", 
    "host": process.env.DB_HOST || "localhost", 
    "dialect": "postgres",
    "benchmark": true,
    "pool": {
      max: 300
    },
    "schema": "public"
  },
  "prod": {
    "username": process.env.DB_USER || "00",
    "password": process.env.DB_PASSWORD || "00",
    "database": process.env.DB_NAME || "c_db",
    "host": process.env.DB_HOST || "127.0.0.1",
    "port": process.env.DB_PORT || 5432,
    "dialect": "postgres",
    "schema": "public",
    "pool": {
      "maxConnections": 10,
      "maxIdleTime": 90000
    }
  }
}


module.exports = config;
