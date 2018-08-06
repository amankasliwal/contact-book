const path = require("path");
const config = {
	"development": {
		"authKey" : "ef73b96c-fd06-464f-90d1-dd211f368b4b",
		"serverurl" : "http://localhost:8081"
	},
	"production" : {
		"authKey" :  process.env.AUTH_KEY || "ef73b96c-fd06-464f-90d1-dd211f368b4b",
		"serverurl" : process.env.SERVER_URL || "http://localhost:8081"
	}
}

module.exports = config;
