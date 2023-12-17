const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const dbUri = process.env.MONGODB_URI;

mongoose.connect(dbUri)
    .then(result => {
        console.log("Connected to MongoDB!");
    })
    .catch(error => {
        console.log("Error connecting to MongoDB:", error.message);
    });

const numberValidator = (n) => {
    try {
        const ls = n.split("-");

        if (ls.length !== 2) {
            return false;
        }

        const part1 = ls[0];

        // part 1 length is 2 or 3

        if (part1.length !== 2 || part1.length !== 3) {
            return false;
        }

        // part 1 consists of just numbers

        const n1 = parseInt(part1, 10);

        // part 2 consists of just numbers

        const part2 = ls[1];

        const n2 = parseInt(part2, 10);
    } catch (e) {
        return false;
    }
};

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: numberValidator,
            message: (props) => `${props.value} is not a valid phone number!`
        },
    },
});

personSchema.set("toJSON", {
    transform: (document, ro) => {
        ro.id = ro._id.toString();
        delete ro._id;
        delete ro.__v;
    },
});

module.exports = mongoose.model("Person", personSchema);
