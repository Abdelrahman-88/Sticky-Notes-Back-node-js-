const { StatusCodes } = require("http-status-codes");
const User = require("../../users/model/user.model");
const pageFun = require("../../../common/service/page")
const searchServies = require("../../../common/service/search");
const Note = require("../model/note.model");


const addNote = async(req, res) => {
    try {
        const { title, content } = req.body
        const { userId } = req.params
        if (userId == req.user._id) {
            const user = await User.findOne({ _id: userId, deactivated: false, blocked: false });
            if (user) {
                const newNote = new Note({ title, content, createdBy: userId })
                const data = await newNote.save()
                res.status(StatusCodes.CREATED).json({ message: "done", data });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid user" });
            }
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to add note" });
    }
}

const updateNote = async(req, res) => {
    try {
        const { _id } = req.user
        const { noteId } = req.params
        const { title, content } = req.body
        const note = await Note.findOne({ _id: noteId, createdBy: _id });
        if (note) {
            const data = await Note.findOneAndUpdate({ _id: noteId }, { title, content }, { new: true })
            res.status(StatusCodes.OK).json({ message: "done", data });
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild o update note" });
    }
}

const deleteNote = async(req, res) => {
    try {
        const { _id, role } = req.user
        const { noteId } = req.params
        if (role == "admin") {
            const note = await Note.findByIdAndDelete({ _id: noteId })
            if (note) {
                res.status(StatusCodes.OK).json({ message: "done" });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid post id" });
            }
        } else {
            const note = await Note.findOneAndDelete({ _id: noteId, createdBy: _id })
            if (note) {
                res.status(StatusCodes.OK).json({ message: "done" });
            } else {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
            }
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to delete note" });
    }
}

const getUserNotes = async(req, res) => {
    try {
        const { _id, role } = req.user
        let { page, size, search } = req.query
        const { skip, limit, currentPage } = pageFun(page, size)
        const { userId } = req.params
        let notes
        if (role === "admin" || _id == userId) {
            notes = await searchServies(search, "createdBy", userId, limit, skip, Note, ["title", "content"], "createdBy", "-password -phone")
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }

        if (notes.data.length) {
            res.status(StatusCodes.OK).json({ message: "done", currentPage, limit, totalPages: notes.totalPages, total: notes.total, data: notes.data });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "No notes found" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to get user notes" });
    }
}

const getAllNotes = async(req, res) => {
    try {
        let { page, size } = req.query
        const { skip, limit, currentPage } = pageFun(page, size)
        const data = await searchServies("", "", limit, skip, Note, "", "createdBy", "-password -phone")
        const total = await Note.count()
        const totalPages = Math.ceil(total / limit)
        res.status(StatusCodes.OK).json({ message: "done", currentPage, limit, totalPages, total, data })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error" });
    }
}



module.exports = {
    addNote,
    updateNote,
    deleteNote,
    getUserNotes,
    getAllNotes
}