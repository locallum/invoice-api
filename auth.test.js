const request = require('supertest');
const { beforeEach, afterEach, describe, test, expect } = require('@jest/globals');
const app = require('./server.js');
const helper = require('./helper');

beforeEach(() => {
  helper.removeFile();
  requestClear();
});

afterEach(() => {
  helper.removeFile();
  requestClear();
});

function requestClear() {
  return new Promise((resolve, reject) => {
    request(app)
      .del('/clear')
      .expect(200)
      .end((error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
  });
}

function requestAuthRegister(name, email, password, password2) {
  return request(app).post('/auth/register').send({ name, email, password, password2 })
}

function requestAuthLogin(email, password) {
  return request(app).post('/auth/login').send({ email, password })
}

function requestAuthLogout(token) {
  return request(app).post('/auth/logout').send({ token })
}

describe('Auth Tests', () => {
  describe('Register Tests', () => {
    test('Invalid email', (done) => {
      requestAuthRegister('name', 'invalidEmail', 'mystery', 'mystery').expect(400, done);
    });

    test('Password too short', (done) => {
      requestAuthRegister('name', 'sherlock.holmes@gmail.com', 'hi', 'hi').expect(400, done);
    });

    test('Passwords do not match', (done) => {
      requestAuthRegister('name', 'sherlock.holmes@gmail.com', 'mystery', 'mystery2').expect(400, done);
    });

    test('Try to register with an existing email', (done) => {
      requestAuthRegister('name', 'sherlock.holmes@gmail.com', 'mystery', 'mystery')
        .expect(200)
        .end((err, res) => {
          expect(res.body).toEqual({ token: expect.any(String), uId: expect.any(Number) })
          done();
        })
      requestAuthRegister('name', 'sherlock.holmes@gmail.com', 'mystery', 'mystery').expect(400, done);
    });

    test('Successful Register', (done) => {
      requestAuthRegister('name', 'sherlock.holmes@gmail.com', 'mystery', 'mystery')
        .expect(200)
        .end((err, res) => {
          expect(res.body).toEqual({ token: expect.any(String), uId: expect.any(Number) })
          done();
        })
    });

  });

  describe('Login Tests', () => {
    test('Invalid email', (done) => {
      requestAuthLogin('invalidEmail', 'mystery').expect(400, done);
    });

    test('Email does not exist', (done) => {
      requestAuthLogin('sherlock.holmes@gmail.com', 'mystery').expect(400, done);
    });

    test('Password is incorrect', (done) => {
      requestAuthRegister('sherlock.holmes@gmail.com', 'mystery').expect(200, done);
      requestAuthLogin('sherlock.holmes@gmail.com', 'incorrect').expect(400, done);
    });

    test('Correct return', (done) => {
      requestAuthRegister('sherlock.holmes@gmail.com', 'mystery').expect(200, done);
      requestAuthLogin('sherlock.holmes@gmail.com', 'mystery')
        .expect(200)
        .end((err, res) => {
          expect(res.body).toEqual({ token: expect.any(String) })
          done();
        })
    });
  });

  describe('Logout Tests', () => {
    test('Invalid token', (done) => {
      requestAuthLogout('invalidToken').expect(403, done);
    });

    test('Successful logout', (done) => {
      requestAuthRegister('sherlock.holmes@gmail.com', 'mystery')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          const token = res.body.token
          requestAuthLogout(token)
            .expect(200)
            .end((err, res) => {
              expect(res.body).toEqual({})
              done();
            })
          done();
        })
      });
  });
});