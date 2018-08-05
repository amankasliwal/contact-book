const utils = require("../utils.js");
const env = process.env.NODE_ENV || "development";
const config = require("../../db/config/config.js")[env];

module.exports = function(sequelize, DataTypes) {
  var Contact = sequelize.define("Contact", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: utils.getDbID,
      allowNull: false
    },
    firstname: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    schema: config.schema
  });
  return Contact;
}
