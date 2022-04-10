const router = require("express").Router()
const validation = require("../../../common/middelware/validation")
const isAuthorized = require("../../../common/middelware/isAuthorized")
const { cardSchema } = require("../validation/payment.validation")
const cardPayment = require("../controler/card")
const { CARD_PAYMENT } = require("../endPoints")



router.post("/cardPayment/:userId", validation(cardSchema), isAuthorized(CARD_PAYMENT), cardPayment)










module.exports = router