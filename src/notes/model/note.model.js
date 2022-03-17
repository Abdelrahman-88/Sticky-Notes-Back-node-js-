const mongoose = require("mongoose")
const noteSchema = require("../schema/note.schema")

const Note = mongoose.model("note", noteSchema)

module.exports = Note