const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {todoModel} = require('./../model/todo');

const mockToDoData = [{text:'dummy Data one'},{text:'dummy Data two'}];

beforeEach((done) => {
    todoModel.remove({}).then(() => {
       return todoModel.insertMany(mockToDoData);
    }).then(()=> done());
});

describe('GET /todo', () => {
  it('should get all the task at the system',(done)=>{
    request(app)
      .get('/todo')
      .expect(200)
      .expect((res) => {
        expect(res.body['todos']).toBe(mockToDoData);
      }).end((err, res) => {
        if (err) {
          return done(err);
        }

        todoModel.find().then((todos) => {
          console.log(`here ???? ${todos}`);
          expect(todos['todos'].length).toBe(mockToDoData.length());
          done();
        }).catch((e) => done(e));
      });
  });
});


describe('POST /todo', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todo')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        todoModel.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todo')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        todoModel.find().then((todos) => {
          expect(todos.length).toBe(mockToDoData.length);
          done();
        }).catch((e) => done('jjjj'+e));
      });
  });
});

