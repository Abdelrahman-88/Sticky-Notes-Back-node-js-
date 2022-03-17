const Joi = require('joi');

module.exports = {
    addUserSchema: {
        body: Joi.object().required().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)).required(),
            cPassword: Joi.ref('password'),
            phone: Joi.string().pattern(new RegExp(/^(010|011|012|015)[0-9]{8}$/)).required(),
            location: Joi.string().required()
        })
    },
    verifyEmailSchema: {
        params: Joi.object().required().keys({
            token: Joi.string().required()
        })
    },
    signInSchema: {
        body: Joi.object().required().keys({
            email: Joi.string().required().email(),
            password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)).required(),
        })
    },
    logOutSchema: {
        params: Joi.object().required().keys({
            id: Joi.string().required().min(24).max(24)
        })
    },
    getUserSchema: {
        params: Joi.object().required().keys({
            id: Joi.string().required().min(24).max(24)
        })
    },
    updateUserSchema: {
        body: Joi.object().required().keys({
            name: Joi.string().required(),
            phone: Joi.string().pattern(new RegExp(/^(010|011|012|015)[0-9]{8}$/)).required(),
            location: Joi.string().required()
        }),
        params: Joi.object().required().keys({
            id: Joi.string().required().min(24).max(24)
        })
    },
    updateEmailSchema: {
        body: Joi.object().required().keys({
            email: Joi.string().email().required()
        }),
        params: Joi.object().required().keys({
            id: Joi.string().required().min(24).max(24)
        })
    },
    updatePasswordSchema: {
        body: Joi.object().required().keys({
            oldPassword: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)).required(),
            newPassword: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)).required(),
            cNewPassword: Joi.ref('newPassword')
        }),
        params: Joi.object().required().keys({
            id: Joi.string().required().min(24).max(24)
        })
    },
    forgetPasswordSchema: {
        body: Joi.object().required().keys({
            email: Joi.string().required().email()
        })
    },
    resetEmailSchema: {
        params: Joi.object().required().keys({
            token: Joi.string().required()
        })
    },
    resetPasswordSchema: {
        body: Joi.object().required().keys({
            newPassword: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)).required(),
            cNewPassword: Joi.ref('newPassword')
        }),
        params: Joi.object().required().keys({
            id: Joi.string().required().min(24).max(24)
        })
    },
    deleteAdminSchema: {
        params: Joi.object().required().keys({
            id: Joi.string().required().min(24).max(24)
        })
    },
    getAllAdminsSchems: {
        query: Joi.object().required().keys({
            page: Joi.string(),
            size: Joi.string()
        })
    },
    blockUserSchema: {
        params: Joi.object().required().keys({
            id: Joi.string().required().min(24).max(24)
        })
    },
    deactivateUserSchema: {
        params: Joi.object().required().keys({
            id: Joi.string().required().min(24).max(24)
        })
    },
    addAdminSchema: {
        body: Joi.object().required().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)).required(),
            cPassword: Joi.ref('password'),
            phone: Joi.string().pattern(new RegExp(/^(010|011|012|015)[0-9]{8}$/)),
            location: Joi.string()
        })
    },
    updateAdminSchema: {
        body: Joi.object().required().keys({
            name: Joi.string(),
            email: Joi.string().email(),
            phone: Joi.string().pattern(new RegExp(/^(010|011|012|015)[0-9]{8}$/)),
            location: Joi.string()
        }),
        params: Joi.object().required().keys({
            id: Joi.string().required().min(24).max(24)
        })
    }
}