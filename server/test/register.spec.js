const db = require("../db/db");

const chai = require("chai");
const chaiHttp = require("chai-http");
const { app } = require("../app.js");

chai.should();
chai.use(chaiHttp);
db.sync({ force: true }).then(() => {});

describe("/POST register", () => {
  it("it should return 201", done => {
    chai
      .request(app)
      .post(`/auth/register`)
      .send({ username: "user", password: "password", email: "email@email.com" })
      .end((err, res) => {
          console.log(res.body)
        res.should.have.status(201);
        res.body.should.have
          .property("response")
          .eql("Shums is not part of the team. Modify your .env");
        done();
      });
  });
});
