const should = require('chai').should();
const expect = require('chai').expect;
const supertest = require('supertest');
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const api = supertest(config.serverurl);

describe('Contact', function () {
	let testContactId = null;
	it('Index should be created', function (done) {
		api.get('/')
			.set('Accept', 'application/json')
			.expect(200, done);
	});

	it('POST should return 200 response', function (done) {
		api.post('/contacts/')
			.set('Accept', 'application/json')
			.set("authorization", 'Basic ZWY3M2I5NmMtZmQwNi00NjRmLTkwZDEtZGQyMTFmMzY4YjRiOg==')
			.send({
				firstname: "Lorem",
				lastname: "Ipsum",
				address: "OR",
				email: "lIpsum@examaple.com",
				phone: "1234567890"
			})
			.expect(200)
			.end(function (err, res) {
				testContactId = res.body.id;
				done();
			});
	});

	it('POST with duplicate email should should validation error', function (done) {
		api.post('/contacts/')
			.set('Accept', 'application/json')
			.set("authorization", 'Basic ZWY3M2I5NmMtZmQwNi00NjRmLTkwZDEtZGQyMTFmMzY4YjRiOg==')
			.send({
				firstname: "Lorem",
				lastname: "Ipsum",
				address: "OR",
				email: "lIpsum@examaple.com",
				phone: "1234567890"
			})
			.expect(200)
			.end(function (err, res) {
				expect(res.body).to.deep.include({message: "Contact with Email Id already exists"});
				done();
			});
	});

	it('POST should return 200 response', function (done) {
		api.post('/contacts/')
			.set('Accept', 'application/json')
			.set("authorization", 'Basic ZWY3M2I5NmMtZmQwNi00NjRmLTkwZDEtZGQyMTFmMzY4YjRiOg==')
			.send({
				firstname: "John",
				lastname: "Doe",
				address: "OR",
				email: "jdoe@examaple.com",
				phone: "1234567800"
			})
			.expect(200, done);
	});

	it('Verifying Contact details', function (done) {
		api.get('/contacts/' + testContactId)
			.set('Accept', 'application/json')
			.set("authorization", 'Basic ZWY3M2I5NmMtZmQwNi00NjRmLTkwZDEtZGQyMTFmMzY4YjRiOg==')
			.expect(200)
			.end(function (err, res) {
				expect(res.body).to.deep.equal({
					id: testContactId,
					firstname: 'Lorem',
					lastname: 'Ipsum',
					email: 'lIpsum@examaple.com',
					phone: "1234567890",
					address: 'OR'
				});
				done();
			});

	});

	it('Update a Contact', function (done) {
		api.put('/contacts/' + testContactId)
			.set('Accept', 'application/json')
			.set("authorization", 'Basic ZWY3M2I5NmMtZmQwNi00NjRmLTkwZDEtZGQyMTFmMzY4YjRiOg==')
			.send({ email: "updatedTest@gmail.com" })
			.expect(200)
			.end(function(err ,res) {
				expect(res.body).to.deep.include({email: "updatedTest@gmail.com"});
				done();
			});
	});

	it('Get all contacts', function (done) {
		api.get('/contacts/?pageSize=1&page=2&query=test')
			.set('Accept', 'application/json')
			.set("authorization", 'Basic ZWY3M2I5NmMtZmQwNi00NjRmLTkwZDEtZGQyMTFmMzY4YjRiOg==')
			.send()
			.expect(200)
			.end(function(err ,res) {
				expect(res.body.results).to.be.an('array');
				expect(res.body.page).to.equal(2);
				done();
			});
	});

	it('Delete a contact', function (done) {
		api.delete('/contacts/'+ testContactId)
			.set('Accept', 'application/json')
			.set("authorization", 'Basic ZWY3M2I5NmMtZmQwNi00NjRmLTkwZDEtZGQyMTFmMzY4YjRiOg==')
			.send()
			.expect(200, done);
	});








}); //end
