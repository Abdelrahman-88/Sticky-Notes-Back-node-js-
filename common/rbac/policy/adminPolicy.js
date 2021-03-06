const {
    GET_USER_NOTES,
    UPDATE_NOTE,
    DELETE_NOTE,
    GET_ALL_NOTES,
    ADD_NOTE
} = require("../../../src/notes/endPoints");
const {
    UPDATE_USER,
    DEACTIVATE_USER,
    UPDATE_PASSWORD,
    RESET_PASSWORD,
    BLOCKED_USER,
    UPDATE_ADMIN,
    LOGOUT
} = require("../../../src/users/endPoints");

module.exports = [UPDATE_USER, UPDATE_PASSWORD, RESET_PASSWORD, UPDATE_ADMIN,
    DEACTIVATE_USER, GET_USER_NOTES, UPDATE_NOTE, DELETE_NOTE, GET_ALL_NOTES, BLOCKED_USER,
    ADD_NOTE, LOGOUT
]