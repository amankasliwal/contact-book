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
	var contact = req.body;
	models.sequelize.transaction(function (t) {
		return Contact.findOrCreate({
			where: {
				email: contact.email
			},
			defaults: contact,
			transaction: t
		})
		.spread(function (userResult, created) {
			var resp = userResult.dataValues;
			resp.status = created ? "CREATED" : "UPDATED";
			res.status(200).send(resp);
		});
	}).catch(err => {
		console.log(err);
		res.status(500).send({ error: true, message : "Internal Server Error"});
	});
});

router.get("/:contactId", (req, res) => {
	var contactId = req.params.contactId;
	Contact.findOne({
		where: { id: contactId }
	}).then(contact => {
		res.status(200).send(contact.dataValues);
	}).catch(err => {
		console.log(err);
		res.status(500).send({ error: true, message : "Internal Server Error"});
	});
});

router.delete("/:contactId", (req, res) => {
	var contactId = req.params.contactId;
	Contact.destroy({
		where: { id: contactId }
	}).then(contact => {
		res.status(200).send({ status: "SUCCESS" });
	}).catch(err => {
		console.log(err);
		res.status(500).send({ error: true, message : "Internal Server Error"});
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
	}).catch(err => {
		console.log(err);
		res.status(500).send({ error: true, message : "Internal Server Error"});
	});
});

module.exports = router;
