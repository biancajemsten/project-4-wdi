/* global describe, it, api, expect, beforeEach */
const User = require('../../../models/user');

const userData = [
  {
    username: 'bianca',
    email: 'bianca@test.com',
    password: 'pass',
    passwordConfirmation: 'pass'
  },{
    username: 'richard',
    email: 'richard@test.com',
    password: 'pass',
    passwordConfirmation: 'pass'
  },{
    username: 'martin',
    email: 'martin@test.com',
    password: 'pass',
    passwordConfirmation: 'pass'
  }
];

describe('GET /users', ()=>{
  beforeEach(done => {
    User
      .remove({})
      .then(() => User.create(userData))
      .then( () => {
        done();
      });
  });

  it('should return a 200 response', done => {
    api.get('/api/users')
      .end((err, res) => {
        expect(res.status).to.eq(200);
        done();
      });
  });

  it('should return an array', done => {
    api.get('/api/users')
      .end((err, res) => {
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should return an array of objects', done => {
    api.get('/api/users')
      .end((err, res) => {
        res.body.forEach(user => expect(user).to.be.an('object'));
        done();
      });
  });

  it('should return the correct data', done => {
    api.get('/api/users')
      .end((err, res) => {
        res.body.forEach((user, index) => {
          expect(user.name).to.eq(userData[index].name);
          expect(user.description).to.eq(userData[index].description);
        });
        done();
      });
  });
});
