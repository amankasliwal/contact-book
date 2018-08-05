const express = require("express")
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];
const router = express.Router();
const models = require('../db/models');
const Contact = models["Contact"];
const Validation = require("../utils/validation");

validateRequest = (req, res, next) => {
	if (!Validation.isValidEmail(req.body.email)) {
		res.status(400).send({ error: true, message: "Invalid Email" });
	}
	if (req.body.phone && !Validation.isValidPhone(req.body.phone)) {
		res.status(400).send({ error: true, message: "Invalid Phone" });
	}
	next();
} 

router.post("/", validateRequest, (req, res) => {
	console.log(req);
	var contact = req.body;
	Contact.create(contact).then(contactDb => {
		res.status(200).send(contactDb);
	})
});

router.get("/:contactId", (req, res) => {
	console.log(req);
	var contactId = req.params.contactId;
	Contact.findOne({
		where: { id: contactId }
	}).then(contact => {
		res.status(200).send(contact.dataValues);
	});
});

router.delete("/:contactId", (req, res) => {
	var contactId = req.params.contactId;
	Contact.destroy({
		where: { id: contactId }
	}).then(contact => {
		res.status(200).send({ status: "SUCCESS" });
	});
});

router.put("/:contactId", validateRequest, (req, res) => {
	var contactId = req.params.contactId;
	updatedContact = req.body;
	Contact.update(updatedContact, {
		where: {
			id: contactId
		},
		returning: true,
		limit: 1
	}).then(contact => {
		res.status(200).send({ status: "SUCCESS" });
	});
});

module.exports = router;
