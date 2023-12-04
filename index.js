const express = require('express');

const app = express();

app.use(express.json());

const morgan = require("morgan");

app.use(morgan("tiny"));

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

const getPerson = ( request, response) => {
    const id = Number(request.params.id);

    const person = persons.find(p => p.id === id);

    if (! person) {
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

    if (! person) {
        response.status(404).end();
        return;
    }

    const newPersons = persons.filter(p => p.id !== id);

    persons = newPersons;

    response.status(200).end();
}

app.delete(`${apiRoot}/persons/:id`, deletePerson);

const addPerson = (request, response) => {
    const newPerson = request.body;

    if (! (newPerson.name && newPerson.phone)) {
        response.status(404).send({error: "Name or phone number missing"});
        return;
    }

    const found = persons.filter(p => p.name === newPerson.name) || [];

    const isDuplicateName = found.length > 0;

    if (isDuplicateName) {
        response.status(404).send({error: "Name must be unique"});
        return;
    }

    const min = 1000;
    const max = 1000000 - min;

    const newId = Math.floor(Math.random() * max) + min;
    console.log("Adding person with new id:", newId);

    newPerson.id = newId;

    persons = persons.concat(newPerson);

    response.status(200).end();
}

app.post(`${apiRoot}/persons`, addPerson);

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
