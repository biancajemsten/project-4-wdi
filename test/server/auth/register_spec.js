/* global describe, it, expect, api, beforeEach */

const User = require('../../../models/user');
const userData = {
  username: 'test',
  email: 'test@test.test',
  password: 'test',
  passwordConfirmation: 'test'
};

describe('POST /register', ()=> {
  beforeEach(done => {
    User.remove({})
      .then(() => {
        done();
      });
  });

  it('should return a 201 response', done => {
    api.post('/api/register')
      .send(userData)
      .end((err, res) =>{
        expect(res.status).to.eq(201);
        done();
      });
  });

  it('should return an object', done => {
    api.post('/api/register')
      .send(userData)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should return a 422 response if the passwords don\'t match', done => {
    const badData = Object.assign({}, userData, { password: 'bad' });
    api
      .post('/api/register')
      .send(badData)
      .end((err, res) => {
        expect(res.status).to.eq(422);
        done();
      });
  });

});
