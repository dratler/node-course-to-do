const config = require('./config/config');
const express = require('express');
const body = require('body-parser');
const {
    ObjectID
} = require('mongodb');
const _ = require('lodash');
const {
    mongoose
} = require('../server/db/mongoose');
const {
    todoModel
} = require('./model/todo');
const {
    userModel
} = require('./model/user');
const {
    authenticate
} = require('./middleware/authenticate');

const port = process.env.PORT;
let app = express();

app.use(body.json());

const TODO_PATH = '/todo';
const USER_PATH = '/user';

app.get(TODO_PATH, (req, res) => {
    todoModel
        .find()
        .then((todos) => {
            res.send({
                todos
            });
        }, (err) => {
            res.status(400).send(e);
        });
});

function isValid(id, res) {
    if (!ObjectID.isValid(id)) {
        res.status(400).send(`Given value is not a valid id ${id}`);
    }
}

app.post(TODO_PATH, (req, res) => {
    let todo = new todoModel({
        text: req.body.text
    });
    todo.save().then(
        (doc) => {
            res.send(doc);
        }, (e) => {
            res.status(400).send(e);
        })
});

app.get(`${TODO_PATH}/:id`, (req, res) => {
    let id = req.params.id;
    isValid(id, res);

    todoModel
        .findById(id)
        .then((todo) => {
            if (!todo) {
                res.status(404).send(`Todo not found by id ${todo}`);
            }
            res.send({
                todo
            });
        }, (err) => {
            res.status(400).send(err);
        });
});


app.delete(`${TODO_PATH}/:id`, (req, res) => {
    let id = req.params.id;
    isValid(id, res);
    todoModel
        .findByIdAndRemove(id)
        .then((todo) => {
            if (!todo) {
                res.status(404).send(`Todo not by id ${todo} was not delete`);
            }
            res.send({
                todo
            });
        }, (err) => {
            res.status(500).send(err);
        });
});

app.patch(`${TODO_PATH}/:id`, (req, res) => {
    const id = req.params.id;
    isValid(id, res);
    const body = _.pick(req.body, ['compeleted', 'text']);
    if (_.isBoolean(body.compeleted) && body.compeleted) {
        body.time_stamp = new Date().getTime();
    } else {
        body.compeleted = false;
        body.time_stamp = null;
    }

    todoModel
        .findByIdAndUpdate(id, {
            $set: body
        }, {
            new: true
        })
        .then((todo) => {
            if (!todo) {
                res.status(404).send(`Todo not by id ${todo} was not delete`);
            }
            res.send({
                todo
            })
        })
        .catch((e) => {
            res.status(500).send(e);
        });
});


app.post(USER_PATH, (req, res) => {

    let user = extarctUserDataFromRequest(req);
    user
        .save()
        .then(() => {
            return user.generateAuthToken();
        })
        .then((token) => {
            res.header('x-auth', token).send(user);
        })
        .catch((e) => {
            res.status(401).send(e);
        });
});

//login
app.post(`${USER_PATH}/login`, (req, res) => {
    let user = extarctUserDataFromRequest(req);
    userModel
        .findByCredentials(user.email, user.password)
        .then((u) => {
            return u.generateAuthToken().then((token) => {
              res.header('x-auth', token).send(u);
            });
        })
        .catch((e) => {
            res.status(400).send(e);
        });
});

let extarctUserDataFromRequest = (req) => {
    let body = _.pick(req.body, ["email", "password"]);
    return new userModel(body);
}

app.get(`${USER_PATH}/me`, authenticate, (req, res) => {
    res.send(req.user);
});


app.listen(port, () => {
    console.log(`server is starting on port ${port}`)
});

module.exports = {
    app
};