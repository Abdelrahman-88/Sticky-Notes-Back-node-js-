const isAuthorized = require("../../../common/middelware/isAuthorized")
const validation = require("../../../common/middelware/validation")
const {
    addNote,
    updateNote,
    deleteNote,
    getUserNotes,
    getAllNotes
} = require("../controler/note.controler")
const {
    ADD_NOTE,
    UPDATE_NOTE,
    DELETE_NOTE,
    GET_USER_NOTES,
    GET_ALL_NOTES
} = require("../endPoints")
const {
    addNoteSchema,
    updateNoteSchema,
    deleteNoteSchema,
    getUserNotesSchema,
    getAllNotesSchems
} = require("../validation/note.validation")

const router = require("express").Router()

router.post("/addNote/:userId", validation(addNoteSchema), isAuthorized(ADD_NOTE), addNote)

router.put("/updateNote/:noteId", validation(updateNoteSchema), isAuthorized(UPDATE_NOTE), updateNote)

router.delete("/deleteNote/:noteId", validation(deleteNoteSchema), isAuthorized(DELETE_NOTE), deleteNote)

router.get("/getUserNotes/:userId", validation(getUserNotesSchema), isAuthorized(GET_USER_NOTES), getUserNotes)

router.get("/getAllNotes", validation(getAllNotesSchems), isAuthorized(GET_ALL_NOTES), getAllNotes)







module.exports = router