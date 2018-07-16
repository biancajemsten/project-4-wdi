/* global describe, it, api, expect, beforeEach */
const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const { secret } = require('../../../config/environment');

const userData =
  {
    username: 'martin',
    email: 'martin@test.com',
    password: 'pass',
    passwordConfirmation: 'pass',
    tel: '+447377103864'
  };

const updatedUserData = {
  username: 'martink',
  email: 'martink@test.com',
  password: 'pass',
  passwordConfirmation: 'pass',
  tel: '+447377103864'
}

let userId;
let token;

describe('PUT /users/:id', ()=>{
  beforeEach(done => {
    User
      .remove({})
      .then(() => User.create(userData))
      .then((user) => {
        userId = user._id;
        token = jwt.sign({ sub: user._id }, secret, { expiresIn: '6h' });
      })
      .then( () => {
        done();
      });
  });

  it('should return a 401 response without a token', done => {
    api.put(`/api/users/${userId}`)
      .end((err, res) => {
        expect(res.status).to.eq(401);
        done();
      });
  });

  it('should return a 200 response', done => {
    api.put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedUserData)
      .end((err, res) => {
        expect(res.status).to.eq(200);
        done();
      });
  });

  it('should return an object', done => {
    api.put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedUserData)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should return the correct data', done => {
    api.put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedUserData)
      .end((err, res) => {
        expect(res.body.name).to.eq(userData.name);
        expect(res.body.description).to.eq(userData.description);
        done();
      });
  });
});
