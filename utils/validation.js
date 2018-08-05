module.exports.isValidEmail = (email) => {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
		return true;
	return false;
};

module.exports.isValidPhone = (phone) => {
	var phoneRegex = /^\d{10}$/;
	if (phone.match(phoneRegex))
		return true;
	return false;
};
