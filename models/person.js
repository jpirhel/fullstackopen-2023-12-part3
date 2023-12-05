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

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

personSchema.set("toJSON", {
    transform: (document, ro) => {
        ro.id = ro._id.toString();
        delete ro._id;
        delete ro.__v;
    },
});

module.exports = mongoose.model("Person", personSchema);
