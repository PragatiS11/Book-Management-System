const mongoose = require("mongoose");

const bookschema = mongoose.Schema({
    title: String,
    year: Number,
    createdBy: String,
    createdAt: { type: Date, default: Date.now },
    userID: String,
    roles: [String]
}, {
    versionKey: false
})

const BookModel = mongoose.model("book", bookschema);

module.exports = {
    BookModel
}