const { ObjectID } = require("mongodb");
const { todoModel } = require("./../../model/todo");
const { userModel } = require("./../../model/user");
const jwt = require("jsonwebtoken");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const mockUsers = [
  {
    _id: userOneId,
    email: "hero@js.com",
    password: "fakePassw0rd",
    tokens: [
      {
        access: 'auth',
        token: jwt
          .sign({ _id: userOneId.toHexString(), access: 'auth' }, 'abc123')
          .toString()
      }
    ]
  },
  {
    _id: userTwoId,
    email: "villain@js.com",
    password: "br00tF0rce",
    tokens: [
      {
        access: 'auth',
        token: jwt
          .sign({ _id: userTwoId.toHexString(), access: 'auth' }, 'abc123')
          .toString()
      }
    ]
  }
];

const mockToDoData = [
  {
    _id: new ObjectID(),
    text: "dummy Data one",
    _creator:userOneId
  },
  {
    _id: new ObjectID(),
    text: "dummy Data two",
    compeleted: true,
    time_stamp: new Date().getTime(),
    _creator:userTwoId
  }
];

const populateTodo = done => {
  todoModel
    .remove({})
    .then(() => {
      return todoModel.insertMany(mockToDoData);
    })
    .then(() => done());
};

const populateUser = done => {
  userModel
    .remove({})
    .then(() => {
      let userOne = new userModel(mockUsers[0]).save();
      let userTwo = new userModel(mockUsers[1]).save();
      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

module.exports = { mockToDoData, populateTodo, mockUsers, populateUser };
