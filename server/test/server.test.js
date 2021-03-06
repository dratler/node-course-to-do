
const expect = require('expect');
const request = require('supertest');
const {ObjectID}= require('mongodb');

const {app} = require('./../server');
const { todoModel } = require('./../model/todo');
const {userModel} = require('./../model/user');
const { mockToDoData, populateTodo, mockUsers, populateUser } = require('./seed/seed');

const TODO_PATH = '/todo';
const USER_PATH = '/user';

beforeEach(populateUser);
beforeEach(populateTodo);

describe('GET /todo', () => {
  it('should get all the task at the system',(done)=>{
    request(app)
      .get(TODO_PATH)
      .set('x-auth',mockUsers[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      }).end(done);
  });

});


describe('POST /todo', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post(TODO_PATH)
      .set('x-auth',mockUsers[0].tokens[0].token)
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
      .set('x-auth',mockUsers[0].tokens[0].token)
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
      .set('x-auth',mockUsers[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body['todo'].text).toBe(mockToDoData[0].text);
      }).end(done);
  });
  it('should return 400 for invalid id',(done)=>{
    request(app)
      .get(`${TODO_PATH}/123`)
      .set('x-auth',mockUsers[0].tokens[0].token)
      .expect(400)
      .end(done);
  });
  it('should return 404 for missing id',(done)=>{
    request(app)
      .get(`${TODO_PATH}/${new ObjectID().toHexString()}`)
      .set('x-auth',mockUsers[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
  it('should not get other creater todo', (done) => {
    request(app)
      .get(`${TODO_PATH}/${mockToDoData[0]._id.toHexString()}`)
      .set('x-auth',mockUsers[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todo/:id',()=>{
  it('should delete a task by id',(done)=>{
    request(app)
      .delete(`${TODO_PATH}/${mockToDoData[0]._id.toHexString()}`)
      .set('x-auth',mockUsers[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body['todo'].text).toBe(mockToDoData[0].text);
    }).end(done);
  });
  it('should return 400 for invalid id',(done)=>{
    request(app)
      .delete(`${TODO_PATH}/123`)
      .set('x-auth',mockUsers[0].tokens[0].token)
      .expect(400)
      .end(done);
  });
  it('should return 404 for missing id',(done)=>{
    request(app)
      .delete(`${TODO_PATH}/${new ObjectID().toHexString()}`)
      .set('x-auth',mockUsers[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

});

describe('PACTH /todo/id',()=>{
  let patch_todo = {text:'That"s all fulks',compeleted:true};
  it('should delete a task by id',(done)=>{
    request(app)
      .patch(`${TODO_PATH}/${mockToDoData[0]._id.toHexString()}`)
    .set('x-auth',mockUsers[0].tokens[0].token)
    .send(patch_todo)
    .expect(200)
    .expect((res) => {
      expect(res.body['todo'].text).toBe(patch_todo.text);
    }).end(done);
  });
  it('should return 400 for invalid id',(done)=>{
    request(app)
      .delete(`${TODO_PATH}/123`)
      .set('x-auth',mockUsers[0].tokens[0].token)
      .expect(400)
      .end(done);
  });
  it('should return 404 for missing id',(done)=>{
    request(app)
      .delete(`${TODO_PATH}/${new ObjectID().toHexString()}`)
      .set('x-auth',mockUsers[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});
describe('POST /user',()=>{
  const u = {email:'aaa@aaaa.com',password:'asdfgh'}
  it('should create a user',(done)=>{
      request(app)
        .post(`${USER_PATH}`)
        .send(u)
        .expect(200)
        .expect((res) => {
        expect(res.body.email).toBe(u.email);
       }).end(done);
  });
  it('should return validation error',(done)=>{
    request(app)
        .post(`${USER_PATH}`)
        .send({password:'halala'})
        .expect(401);

    request(app)
        .post(`${USER_PATH}`)
        .send({email:'a'})
        .expect(401)
        .end(done);
  });
  it('should prevent creation of duplicate user',(done)=>{
     request(app)
        .post(`${USER_PATH}`)
        .send(u)
        .expect(200)
        .end(done);
  });
});

describe('GET /user/me',()=>{
  it('should return authenticated user by token',(done)=>{
    request(app)
      .get(`${USER_PATH}/me`)
      .set('x-auth',mockUsers[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(mockUsers[0]._id.toHexString());
        expect(res.body.email).toBe(mockUsers[0].email);
       }).end(done);
  });
  it('should return 401 for non-authenticated user',(done)=>{
    request(app)
    .get(`${USER_PATH}/me`)
    .expect(401)
    .end(done);
  });
});

describe('POST /user/login', () => {
  it('should return token on login', (done) => {
    request(app)
      .post(`${USER_PATH}/login`)
      .send(mockUsers[0])
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy()
      }).end((err, res) => {
        if (err) {
          return done(err);
        }
        userModel.findById(mockUsers[0]._id).then((u) => {
          expect(u.tokens[1]).toMatchObject({
            'access': 'auth',
            'token': res.headers['x-auth']
          });
          done();
        }).catch((e) => { done(e) })
      })
  });
    it('should reject invalid login', (done) => {
      request(app)
        .post(`${USER_PATH}/login`)
        .send({ email: mockUsers[0].email, password: 'invalidPa$$' })
        .expect(400)
        .expect((res) => {
          expect(res.headers['x-auth']).toBeFalsy();
        })
        .end(done);
    });
  });

describe('DELETE /user/me/token', () => {
  let token = mockUsers[0].tokens[0].token;
  it('should delete a token for logout', (done) => {
    request(app)
      .delete(`${USER_PATH}/me/token`)
      .set('x-auth',token )
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        userModel.findById(mockUsers[0]._id).then((u) => {
          expect(u.tokens.length).toEqual(0);

          done();
        }).catch((e) => { done(e) })
      });
  });
});