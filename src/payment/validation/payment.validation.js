const Joi = require('joi');

module.exports = {
    cardSchema: {
        body: Joi.object().required().keys({
            token: Joi.object().required()
        }),
        params: Joi.object().required().keys({
            userId: Joi.string().required().min(24).max(24)
        })
    },
    userPaymentSchema: {
        params: Joi.object().required().keys({
            userId: Joi.string().required().min(24).max(24)
        }),
        query: Joi.object().required().keys({
            page: Joi.string(),
            size: Joi.string()
        })
    }
}