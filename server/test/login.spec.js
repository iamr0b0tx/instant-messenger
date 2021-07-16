const chai = require("chai");
const chaiHttp = require("chai-http");
const { app } = require("../app.js");

chai.should();
chai.use(chaiHttp);

describe("/POST login", async () => {
	it("it should return 200", done => {
		chai
			.request(app)
			.post(`/auth/login`)
			.send({ username: "thomas", password: "123456"})
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.have
					.property("id")
					.eql(1);
				done();
			});
	});
});
