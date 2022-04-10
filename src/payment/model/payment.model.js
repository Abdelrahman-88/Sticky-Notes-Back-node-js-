const mongoose = require("mongoose")
const paymentSchema = require("../schema/payment.schema")

const Payment = mongoose.model("payment", paymentSchema)

module.exports = Payment