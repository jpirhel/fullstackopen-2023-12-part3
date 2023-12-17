require("dotenv").config();

const mongoose = require("mongoose");

const express = require('express');

const app = express();

app.use(express.json());

const cors = require("cors");
app.use(cors());

// frontend production build static directory
app.use(express.static("static"))

const morgan = require("morgan");

const Person = require("./models/person");

const morganHandler = (tokens, req, res) => {
    // const tiny = ":method :url :status :res[content-length] - :response-time ms";

    const method = tokens.method(req, res);

    const tinyTokens = [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms'
    ];

    const tinyLogString = tinyTokens.join(" ");

    switch (method) {
        case "POST":
            // NOTE could probably fetch this more directly from request
            //      instead of going through JSON.parse -> JSON.stringify
            const data = JSON.stringify(req.body);
            return `${tinyLogString} ${data}`;
        default:
            return tinyLogString;
    }
}

app.use(morgan(morganHandler));

const apiRoot = "/api";

const getPersons = (request, response, next) => {
    Person.find({})
        .then((result) => {
            response.json(result);
        })
        .catch(error => next(error));
}

app.get(`${apiRoot}/persons`, getPersons);

const getPerson = (request, response) => {
    const id = request.params.id;

    Person.findById(id)
        .then(person => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
}

app.get(`${apiRoot}/persons/:id`, getPerson);

const getInfo = (request, response, next) => {
    Person.find({})
        .then((result) => {
            const numPersons = result.length;

            const now = new Date();

            const res = `Phonebook has info for ${numPersons} people<br /><br />${now}`

            return response.send(res);
        })
        .catch(error => next(error));
}

app.get(`/info`, getInfo);

const deletePerson = (request, response, next) => {
    const id = request.params.id;

    Person.findByIdAndDelete(id)
        .then(result => {
            response.status(204).end();
        })
        .catch(error => next(error));

    response.status(200).end();
}

app.delete(`${apiRoot}/persons/:id`, deletePerson);

const addPerson = (request, response, next) => {
    const data = request.body;

    if (!(data.name && data.number)) {
        response.status(404).send({error: "Name or phone number missing"});
        return;
    }

    const person = new Person(data);

    person.save()
        .then(savedPerson => {
            response.status(200).send(JSON.stringify(savedPerson));
        })
        .catch(error => next(error));
}

app.post(`${apiRoot}/persons`, addPerson);

const errorHandler = (error, request, response, next) => {
    console.log("errorHandler, error.message:", error.message);

    // :id is malformed
    if (error.name === 'CastError') {
        return response.status(400).send({error: "malformatted id"});
    }

    next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
