process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var app = require('../../../app.js');
var Note = require('../../../app/models/notes.js');

chai.use(chaiHttp);

describe('Notes', function() {
  'use strict';

  var newNote;

  Note.collection.drop();

  beforeEach(function(done){
    newNote = new Note({
      title: 'Note Title',
      content: 'Example note body'
    });

    newNote.save(function(err) {
      if (err) {
        console.log('Error saving to database:', err);
      } else {
        done();
      }
    });
  });

  afterEach(function (done) {
    Note.collection.drop();
    done();
  });

  it('should return all notes on /notes GET', function (done) {
    chai.request(app)
      .get('/notes')
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        done();
      });
  });

  it('should return a note on /notes/:id GET', function (done) {
    chai.request(app)
      .get('/notes/' + newNote.id)
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('_id');
        res.body.should.have.property('title');
        res.body.should.have.property('content');
        res.body.title.should.equal('Note Title');
        res.body.content.should.equal('Example note body');
        res.body._id.should.equal(newNote.id);
        done();
      });
  });

  it('should add a note on /notes POST', function (done) {
    chai.request(app)
      .post('/notes')
      .send({'title': 'Note Title', 'content': 'Example note body'})
      .end(function (err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('SUCCESS');
        res.body.SUCCESS.should.be.a('object');
        res.body.SUCCESS.should.have.property('title');
        res.body.SUCCESS.should.have.property('content');
        res.body.SUCCESS.should.have.property('_id');
        res.body.SUCCESS.title.should.equal('Note Title');
        res.body.SUCCESS.content.should.equal('Example note body');
        done();
      });
  });
});
