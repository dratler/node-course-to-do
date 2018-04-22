const expect = require('expect');
const request = require('supertest');
const {ObjectID}= require('mongodb');

const {app} = require('./../server');
const {todoModel} = require('./../model/todo');

const TODO_PATH = '/todo';

const mockToDoData = [
  {
    _id:new ObjectID() ,
    text:'dummy Data one'
  },{
    _id:new ObjectID(),
    text:'dummy Data two',
    compeleted:true,
    time_stamp: new Date().getTime()
  }
];

beforeEach((done) => {
    todoModel.remove({}).then(() => {
       return todoModel.insertMany(mockToDoData);
    }).then(()=> done());
});

describe('GET /todo', () => {
  it('should get all the task at the system',(done)=>{
    request(app)
      .get(TODO_PATH)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      }).end((err, res) => {
        if (err) {
          return done(err);
        }

        todoModel.find().then((todos) => {
          expect(Object.keys(todos).length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});


describe('POST /todo', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post(TODO_PATH)
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
      .post(TODO_PATH)
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

describe('GET /todo/:id', () => {
  it('should return a task by id',(done)=>{
    request(app)
      .get(`${TODO_PATH}/${mockToDoData[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body['todo'].text).toBe(mockToDoData[0].text);
      }).end(done);
  });
  it('should return 400 for invalid id',(done)=>{
    request(app)
      .get(`${TODO_PATH}/123`)
      .expect(400)
      .end(done);
  });
  it('should return 404 for missing id',(done)=>{
    request(app)
      .get(`${TODO_PATH}/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todo/:id',()=>{
  it('should delete a task by id',(done)=>{
    request(app)
    .delete(`${TODO_PATH}/${mockToDoData[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body['todo'].text).toBe(mockToDoData[0].text);
    }).end(done);
  });
  it('should return 400 for invalid id',(done)=>{
    request(app)
      .delete(`${TODO_PATH}/123`)
      .expect(400)
      .end(done);
  });
  it('should return 404 for missing id',(done)=>{
    request(app)
      .delete(`${TODO_PATH}/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });
  
});

describe('PACTH /todo/id',()=>{
  let patch_todo = {text:'That"s all fulks',compeleted:true};
  it('should delete a task by id',(done)=>{
    request(app)
    .patch(`${TODO_PATH}/${mockToDoData[0]._id.toHexString()}`)
    .send(patch_todo)
    .expect(200)
    .expect((res) => {
      expect(res.body['todo'].text).toBe(patch_todo.text);
    }).end(done);
  });
  it('should return 400 for invalid id',(done)=>{
    request(app)
      .delete(`${TODO_PATH}/123`)
      .expect(400)
      .end(done);
  });
  it('should return 404 for missing id',(done)=>{
    request(app)
      .delete(`${TODO_PATH}/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });
});
