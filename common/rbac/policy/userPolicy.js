const {
    GET_USER_NOTES,
    UPDATE_NOTE,
    DELETE_NOTE,
    ADD_NOTE
} = require("../../../src/notes/endPoints");
const { CARD_PAYMENT, USER_PAYMENTS } = require("../../../src/payment/endPoints");
const {
    UPDATE_USER,
    DEACTIVATE_USER,
    UPDATE_PASSWORD,
    RESET_PASSWORD,
    GET_USER,
    UPDATE_EMAIL,
    LOGOUT
} = require("../../../src/users/endPoints");

module.exports = [UPDATE_USER, UPDATE_PASSWORD, RESET_PASSWORD, GET_USER_NOTES, UPDATE_NOTE, DELETE_NOTE, DEACTIVATE_USER,
    ADD_NOTE, GET_USER, UPDATE_EMAIL, LOGOUT, CARD_PAYMENT, USER_PAYMENTS
]