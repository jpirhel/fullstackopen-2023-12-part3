const express = require('express');

const app = express();

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

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
