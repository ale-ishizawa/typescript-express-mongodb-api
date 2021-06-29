import app from '../../app';
import supertest from 'supertest';
import { expect } from 'chai';
import shortid from 'shortid';
import mongoose from 'mongoose';

let firstUserIdTest = '';
const firstUserBody = {
  email: `alessandro+${shortid.generate()}@test.com`,
  password: 's$12crET!/.',
};

let accessToken = '';
let refreshToken = '';
const newFirstName = 'Alessandro';
const newFirstName2 = 'Navarro';
const newLastName = 'Ishizawa';

describe('users and auth endpoints', () => {
  let request: supertest.SuperAgentTest;
  before(() => {
    request = supertest.agent(app);
  });
  after((done) => {
    app.close(() => {
      mongoose.connection.close(done);
    });
  });

  it('should allow a POST to /users', async function () {
    const res = await request.post('/users').send(firstUserBody);

    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body.id).to.be.a('string');
    firstUserIdTest = res.body.id;
  });

  it('should allow a POST to /auth', async function () {
    const res = await request.post('/auth').send(firstUserBody);
    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body.accessToken).to.be.a('string');
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('should allow a GET from /users/:userId with an access token', async function () {
    const res = await request
        .get(`/users/${firstUserIdTest}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send();
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body._id).to.be.a('string');
    expect(res.body._id).to.equal(firstUserIdTest);
    expect(res.body.email).to.equal(firstUserBody.email);
  });

  describe('with a valid access token', function () {
    it('should allow a GET from /users', async function () {
        const res = await request
            .get(`/users`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();
        expect(res.status).to.equal(200);
      });
    });

    it('should disallow a PUT to /users/:userId with an nonexistent ID', async function () {
      const res = await request
          .put(`/users/i-do-not-exist`)
          .set({ Authorization: `Bearer ${accessToken}` })
          .send({
              email: firstUserBody.email,
              password: firstUserBody.password,
              firstName: 'Marcos',
              lastName: 'Silva',
              permissionFlags: 256,
          });
      expect(res.status).to.equal(404);
    });

    it('should allow a PUT to /users/:userId to change first and last names', async function () {
      const res = await request
          .put(`/users/${firstUserIdTest}`)
          .set({ Authorization: `Bearer ${accessToken}` })
          .send({
              email: firstUserBody.email,
              password: firstUserBody.password,
              firstName: newFirstName2,
              lastName: newLastName,
              permissionFlags: 2,
          });
      expect(res.status).to.equal(204);
    });

    it('should allow a DELETE from /users/:userId', async function () {
      const res = await request
          .delete(`/users/${firstUserIdTest}`)
          .set({ Authorization: `Bearer ${accessToken}` })
          .send();
      expect(res.status).to.equal(204);
    });

});

