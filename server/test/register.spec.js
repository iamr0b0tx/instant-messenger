const chai = require("chai");
const chaiHttp = require("chai-http");
const { app } = require("../app.js");


chai.should();
chai.use(chaiHttp);

describe("/POST register", async () => {
	it("it should return 200", done => {
		chai
			.request(app)
			.post(`/auth/register`)
			.send({ username: "user", password: "password", email: "email@email.com" })
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.have
					.property("username")
					.eql("user");
				done();
			});
	});
});
