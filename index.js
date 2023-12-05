const express = require('express');

const app = express();

app.use(express.json());

const cors = require("cors");
app.use(cors());

const morgan = require("morgan");

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

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

const getPersons = (request, response) => {
    response.json(persons);
}

app.get(`${apiRoot}/persons`, getPersons);

const getPerson = (request, response) => {
    const id = Number(request.params.id);

    const person = persons.find(p => p.id === id);

    if (!person) {
        response.status(404).end();
        return;
    }

    response.json(person);
}

app.get(`${apiRoot}/persons/:id`, getPerson);

const getInfo = (request, response) => {
    const numPersons = persons.length;

    const now = new Date();

    const res = `Phonebook has info for ${numPersons} people<br /><br />${now}`

    return response.send(res);
}

app.get(`/info`, getInfo);

const deletePerson = (request, response) => {
    const id = Number(request.params.id);

    const person = persons.find(p => p.id === id);

    if (!person) {
        response.status(404).end();
        return;
    }

    const newPersons = persons.filter(p => p.id !== id);

    persons = newPersons;

    response.status(200).end();
}

app.delete(`${apiRoot}/persons/:id`, deletePerson);

const addPerson = (request, response) => {
    const person = request.body;

    if (!(person.name && person.number)) {
        response.status(404).send({error: "Name or phone number missing"});
        return;
    }

    const found = persons.filter(p => p.name === person.name) || [];

    const isDuplicateName = found.length > 0;

    if (isDuplicateName) {
        response.status(404).send({error: "Name must be unique"});
        return;
    }

    const min = 1000;
    const max = 1000000 - min;

    const newId = Math.floor(Math.random() * max) + min;

    const newPerson = {...person};
    newPerson.id = newId;

    persons = persons.concat(newPerson);

    response.status(200).send(newPerson);
}

app.post(`${apiRoot}/persons`, addPerson);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
