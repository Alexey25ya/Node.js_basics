const express = require('express');
const Joi = require('joi');
const fs = require("fs");
const path = require("path");
const pathFile = path.join(__dirname, "users.json");

const userSchema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    age: Joi.number().min(0).required(),
    city: Joi.string().min(2),
});

function existsFile(pathFile) {
    if (!fs.existsSync(pathFile)) {
        const users = [];
        fs.writeFile(pathFile, JSON.stringify(users, null, 2), (error) => {
            if (error)
                console.log(error);
        });
    }
}

const app = express();

app.use(express.json());

let uId = 0;

app.get('/users', (req, res) => {
    existsFile(pathFile);
    fs.readFile(pathFile, "utf-8", (error, data) => {
        if (error)
            console.log(error);
        const users = JSON.parse(data, "utf-8");
        res.send({ users });
    })
});

app.get('/users/:id', (req, res) => {
    existsFile(pathFile);
    fs.readFile(pathFile, "utf-8", (error, data) => {
        if (error)
            console.log(error);
        const dataUsers = JSON.parse(data, "utf-8");
        const user = dataUsers.find((user) => user.id === +req.params.id);

        if (user) {
            res.send({ user });
        } else {
            res.status(404);
            res.send({ user: null });
        }
    })
});

app.post('/users', (req, res) => {
    const result = userSchema.validate(req.body);

    if (result.error) {
        return res
            .status(500)
            .send({ error: result.error.details });
    }
    existsFile(pathFile);
    uId += 1;

    fs.readFile(pathFile, "utf-8", (error, data) => {
        if (error)
            console.log(error);
        const dataUsers = JSON.parse(data, "utf-8");

        dataUsers.push({
            id: uId,
            ...req.body,
        });
        fs.writeFile(pathFile, JSON.stringify(dataUsers, null, 2), (error) => {
            if (error)
                console.log(error);
        });
        res.send({ id: uId });
    })
});


app.put('/users/:id', (req, res) => {
    const result = userSchema.validate(req.body);

    if (result.error) {
        return res
            .status(500)
            .send({ error: result.error.details });
    }
    existsFile(pathFile);
    fs.readFile(pathFile, "utf-8", (error, data) => {
        if (error)
            console.log(error);
        const dataUsers = JSON.parse(data, "utf-8");

        const user = dataUsers.find((user) => user.id === +req.params.id);

        if (user) {
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.age = req.body.age;
            user.city = req.body.city;
            fs.writeFile(pathFile, JSON.stringify(dataUsers, null, 2), (error) => {
                if (error)
                    console.log(error);
            });
            res.send({ user });
        } else {
            res.status(404);
            res.send({ user: null });
        }
    });
});

app.delete('/users/:id', (req, res) => {
    existsFile(pathFile);
    fs.readFile(pathFile, "utf-8", (error, data) => {
        if (error)
            console.log(error);
        const dataUsers = JSON.parse(data, "utf-8");
        const user = dataUsers.find((user) => user.id === +req.params.id);
        if (user) {
            const userIndex = dataUsers.indexOf(user);
            dataUsers.splice(userIndex, 1);
            if (dataUsers.length < 1) {
                const users = [];
                fs.writeFile(pathFile, JSON.stringify(users, null, 2), (error) => {
                    if (error)
                        console.log(error);
                });
            }
            fs.writeFile(pathFile, JSON.stringify(dataUsers, null, 2), (error) => {
                if (error)
                    console.log(error);
            });

            res.send({ user });
        } else {
            res.status(404);
            res.send({ user: null });
        }
    });
});

app.listen(3000, () => console.log("Сервер запущен!"));