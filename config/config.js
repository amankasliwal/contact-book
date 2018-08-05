const path = require("path");
const config = {
	"development": {
		"authKey" : "97790b63-c2f4-42e5-b5b7-f03cdad7536b"
	},
	"production" : {
		"authKey" :  process.env.AUTH_KEY || "ef73b96c-fd06-464f-90d1-dd211f368b4b"
	}
}

module.exports = config;
