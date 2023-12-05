const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("Give MongoDB password as an argument");
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://jpir:${password}@cluster0.paqm6bf.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model("Person", personSchema);

const addPerson = (data) => {
    const person = new Person(data);

    person.save().then(result => {
        const {name, number} = data;

        console.log(`added ${name} number ${number} to phonebook`);

        mongoose.connection.close();
    }).catch(e => {
        console.log("Failed to add a person, error:", e);
    });
};

const listAllPersons = () => {
    Person.find({}).then(result => {
        console.log("phonebook:");

        result.forEach(person => {
            const {name, number} = person;
            console.log(`${name} ${number}`);
        });

        mongoose.connection.close();
    }).catch(e => {
        console.log("Failed to list all persons, error:", e);
    });
};

if (process.argv.length === 5) {
    const name = process.argv[3];
    const number = process.argv[4];

    const data = {name, number};

    addPerson(data);
} else if (process.argv.length === 3) {
    listAllPersons();
} else {
    console.log("Wrong number of arguments");
    mongoose.connection.close();
}
