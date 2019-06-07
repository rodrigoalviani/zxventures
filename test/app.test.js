/* eslint-disable no-undef */
process.env.NODE_ENV = 'test';

const request = require('supertest');
const should = require('should');

const app = require('../app');

const json = {
  id: 100,
  tradingName: 'Bar do Jão',
  ownerName: 'Jão do Bar',
  document: '12.345.678/000199',
  address: {
    type: 'Point',
    coordinates: [12.123, 21.321],
  },
  coverageArea: {
    type: 'MultiPolygon',
    coordinates: [[[[12.123, 21.321], [12.124, 21.320]]]],
  },
};

describe('Test API endpoints', () => {
  describe('[GET] /api/pdv', () => {
    it('should return an error [400] (no querystring)', (done) => {
      request(app)
        .get('/api/pdv')
        .end((err, res) => {
          should.not.exist(err);
          should.equal(res.status, 400);
          should.exist(res.body.err);
          should.equal(res.body.err, 'll is required');
          done();
        });
    });

    it('should return an error [400] (malformed querystring)', (done) => {
      request(app)
        .get('/api/pdv?ll=0')
        .end((err, res) => {
          should.not.exist(err);
          should.equal(res.status, 400);
          should.exist(res.body.err);
          should.equal(res.body.err, 'll is required');
          done();
        });
    });

    it('should return an error [400] (invalid long)', (done) => {
      request(app)
        .get('/api/pdv?ll=200,0')
        .end((err, res) => {
          should.not.exist(err);
          should.equal(res.status, 400);
          should.exist(res.body.err);
          should.equal(res.body.err, 'long is not valid');
          done();
        });
    });

    it('should return an error [400] (invalid lat)', (done) => {
      request(app)
        .get('/api/pdv?ll=0,100')
        .end((err, res) => {
          should.not.exist(err);
          should.equal(res.status, 400);
          should.exist(res.body.err);
          should.equal(res.body.err, 'lat is not valid');
          done();
        });
    });

    it('should return an error [404] (no pdv found)', (done) => {
      request(app)
        .get('/api/pdv?ll=-180,90')
        .end((err, res) => {
          should.not.exist(err);
          should.equal(res.status, 404);
          should.exist(res.body.err);
          should.equal(res.body.err, 'pdv not found');
          done();
        });
    });

    it('should return success [200]', (done) => {
      request(app)
        .get('/api/pdv?ll=-43.297,-23.013')
        .end((err, res) => {
          should.not.exist(err);
          should.equal(res.status, 200);
          should.exist(res.body.message);
          should.equal(res.body.message.id, 1);
          done();
        });
    });
  });

  describe('[GET] /api/pdv/:id', () => {
    it('should return an error [400] (invalid or missing id)', (done) => {
      request(app)
        .get('/api/pdv/X')
        .end((err, res) => {
          should.not.exist(err);
          should.equal(res.status, 400);
          should.exist(res.body.err);
          should.equal(res.body.err, 'id is required');
          done();
        });
    });

    it('should return an error [404] (pdv not found)', (done) => {
      request(app)
        .get('/api/pdv/999')
        .end((err, res) => {
          should.not.exist(err);
          should.equal(res.status, 404);
          should.exist(res.body.err);
          should.equal(res.body.err, 'pdv not found');
          done();
        });
    });
  });

  describe('[POST] /api/pdv/:id', () => {
    it('should return an error [400] (fields required)', (done) => {
      request(app)
        .post('/api/pdv')
        .end((err, res) => {
          should.not.exist(err);
          should.equal(res.status, 400);
          should.exist(res.body.err);
          should.equal(res.body.err, 'all fields are required');
          done();
        });
    });

    it('should return success [201]', (done) => {
      request(app)
        .post('/api/pdv')
        .send(json)
        .end((err, res) => {
          should.not.exist(err);
          should.equal(res.status, 201);
          should.exist(res.body.message);
          should.equal(res.body.message, 'created');
          done();
        });
    });

    it('should return an error [400] (duplicate key)', (done) => {
      request(app)
        .post('/api/pdv')
        .send(json)
        .end((err, res) => {
          should.not.exist(err);
          should.equal(res.status, 400);
          should.exist(res.body.err);
          should.equal(res.body.err, 'duplicate key');
          done();
        });
    });
  });

  after(() => process.exit());
});
