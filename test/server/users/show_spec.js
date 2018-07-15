/* global describe, it, api, expect, beforeEach */
const User = require('../../../models/user');

const userData =
  {
    username: 'martin',
    email: 'martin@test.com',
    password: 'pass',
    passwordConfirmation: 'pass',
    tel: '+447377103864'
  };

let userId;

describe('GET /users/:id', ()=>{
  beforeEach(done => {
    User
      .remove({})
      .then(() => User.create(userData))
      .then((user) => {
        userId = user._id;
      })
      .then( () => {
        done();
      });
  });

  it('should return a 200 response', done => {
    api.get(`/api/users/${userId}`)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        done();
      });
  });

  it('should return an object', done => {
    api.get(`/api/users/${userId}`)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should return the correct data', done => {
    api.get(`/api/users/${userId}`)
      .end((err, res) => {
        expect(res.body.name).to.eq(userData.name);
        expect(res.body.email).to.eq(userData.email);
        done();
      });
  });
});
