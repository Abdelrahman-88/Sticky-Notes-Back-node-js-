const Joi = require('joi');

module.exports = {
    addNoteSchema: {
        body: Joi.object().required().keys({
            title: Joi.string().required(),
            content: Joi.string().required()
        }),
        params: Joi.object().required().keys({
            userId: Joi.string().required().min(24).max(24)
        })
    },
    updateNoteSchema: {
        body: Joi.object().required().keys({
            title: Joi.string().required(),
            content: Joi.string().required()
        }),
        params: Joi.object().required().keys({
            noteId: Joi.string().required().min(24).max(24)
        })
    },
    deleteNoteSchema: {
        params: Joi.object().required().keys({
            noteId: Joi.string().required().min(24).max(24)
        })
    },
    getUserNotesSchema: {
        params: Joi.object().required().keys({
            userId: Joi.string().required().min(24).max(24)
        }),
        query: Joi.object().required().keys({
            page: Joi.string().allow(''),
            size: Joi.string().allow(''),
            search: Joi.string().allow('')
        })
    },
    getAllNotesSchems: {
        query: Joi.object().required().keys({
            page: Joi.string().allow(''),
            size: Joi.string().allow('')
        })
    }
}