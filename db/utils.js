const env = process.env.NODE_ENV || "development";
const uuid = require("uuid");

const getDbID = () => {
  return "C" + uuid.v4().substr(1, 34).replace(/-/g,"");
}
exports.getDbID = getDbID;