const router = require("express").Router()
const validation = require("../../../common/middelware/validation")
const isAuthorized = require("../../../common/middelware/isAuthorized")
const {
    cardSchema,
    userPaymentSchema
} = require("../validation/payment.validation")
const cardPayment = require("../controler/card")
const {
    CARD_PAYMENT,
    USER_PAYMENTS
} = require("../endPoints")
const userPayment = require("../controler/payment")



router.post("/cardPayment/:userId", validation(cardSchema), isAuthorized(CARD_PAYMENT), cardPayment)

router.get("/userPayment/:userId", validation(userPaymentSchema), isAuthorized(USER_PAYMENTS), userPayment)








module.exports = router