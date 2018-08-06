const express = require("express")
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];
const router = express.Router();
const models = require('../db/models');
const Contact = models["Contact"];
const Validation = require("../utils/validation");
const Op = require("../db/models").Sequelize.Op;

validateRequest = (req, res, next) => {
	if (!Validation.isValidEmail(req.body.email)) {
		res.status(400).send({ error: true, message: "Invalid Email" });
	}
	if (req.body.phone && !Validation.isValidPhone(req.body.phone)) {
		res.status(400).send({ error: true, message: "Invalid Phone" });
	}
	next();
}

router.get("/", (req, res) => {
	var pageNum = req.query.page ? parseInt(req.query.page) : 1;
	let pageSize = parseInt(req.query.pageSize);
	var perPage = isNaN(pageSize) ? 10 : Math.min(pageSize, 100);
	var query = req.query.query ? ('%' + req.query.query + '%') : null;
	var options = {
		offset: (pageNum - 1) * perPage,
		limit: perPage
	};
	if (query) {
		options.where = {
			[Op.or]: {
				email: {
					[Op.like]: query
				},
				firstname: {
					[Op.like]: query
				},
				lastname: {
					[Op.like]: query
				}
			}
		}
	}
	Contact.findAndCountAll(options)
		.then(result => {
			var resp = {
				results: result.rows.map(x => x.dataValues),
				count: result.count,
				page: pageNum,
				pages: Math.ceil(result.count / perPage)
			}
			res.status(200).send(resp);

		})
		.catch(err => {
			console.log(err);
			res.status(500).send({ error: true, message: "Internal Server Error" });
		});
})

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
			if(created) {
				var resp = userResult.dataValues;
				resp.status = created ? "CREATED" : "UPDATED";
				res.status(200).send(resp);
			} else{
				res.status(200).send({ error: true, message: "Contact with Email Id already exists" });
			}

		});
	}).catch(err => {
		console.log(err);
		res.status(500).send({ error: true, message: "Internal Server Error" });
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
		res.status(500).send({ error: true, message: "Internal Server Error" });
	});
});

router.delete("/:contactId", (req, res) => {
	var contactId = req.params.contactId;
	Contact.destroy({
		where: { id: contactId }
	}).then(contact => {
		res.status(200).send({ status: "Deleted Successfully." });
	}).catch(err => {
		console.log(err);
		res.status(500).send({ error: true, message: "Internal Server Error" });
	});
});

cleanupContact = (contact) => {
	return {
		email: contact.email,
		phone: contact.phone,
		firstname: contact.firstname,
		lastname: contact.lastname,
		address: contact.address
	}
}
router.put("/:contactId", validateRequest, (req, res) => {
	var contactId = req.params.contactId;
	updatedContact = cleanupContact(req.body);
	Contact.update(updatedContact, {
		where: {
			id: contactId
		},
		returning: true,
		limit: 1
	}).then(updated => {
		console.log("UPDATED", updated[1]);
		if(updated[0] == 1) {
			res.status(200).send(updated[1][0].dataValues);
		} else {
			res.status(200).send({ error: true, message: "Contact not found" });
		}
	}).catch(err => {
		console.log(err)
		if(err.name == "SequelizeUniqueConstraintError"){
			res.status(200).send({ error: true, message: "Contact with Email Id already exists" });
		} else {
			res.status(500).send({ error: true, message: "Internal Server Error" });
		}
	});
});

module.exports = router;
