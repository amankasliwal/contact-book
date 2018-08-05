const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];
var basicAuth = require('basic-auth');

module.exports = function(req, res, next) {
  let state = req.state;
  if(headerAuth(req)) {
		return next();
	}
	res.status(401).send({ error: true, message: "Invalid Credentails" });
};

const headerAuth = (req) => {
	var user = basicAuth(req);
  if (!user || !user.name || user.name !== config.authKey) {
    return false;
  };
  return true;
};
