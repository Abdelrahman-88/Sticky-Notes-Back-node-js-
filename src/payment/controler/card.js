const stripe = require('stripe')(process.env.SECRET_kEY_API);
const { StatusCodes, PAYMENT_REQUIRED } = require('http-status-codes');
const { nanoid } = require("nanoid");
const User = require('../../users/model/user.model');
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const Payment = require('../model/payment.model');


const cardPayment = async(req, res) => {
    try {
        const { token } = req.body
        const { userId } = req.params
        const idempotencyKey = nanoid()
        return stripe.customers
            .create({
                email: token.email,
                source: token.id
            })

        .then((customer) => {
                stripe.charges.create({
                    amount: 15000,
                    currency: 'USD',
                    customer: customer.id,
                    receipt_email: token.email,
                    description: 'Subscription to notes'
                }, { idempotencyKey });
            })
            .then(async(result) => {
                const newPayment = new Payment({ createdBy: userId, status: "successed" })
                const pay = await newPayment.save()
                const user = await User.findOneAndUpdate({ _id: userId }, { subscription: true }, { new: true });
                const bytes = CryptoJS.AES.decrypt(user.phone, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
                const { password, phone, ...rest } = user._doc
                const token = jwt.sign({...rest, phone: bytes }, process.env.SECRET_KEY)
                res.status(StatusCodes.CREATED).json({ message: "done", token });
            })
            .catch(async(err) => {
                const newPayment = new Payment({ createdBy: userId, status: "failed" })
                const pay = await newPayment.save()
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed" });
            });
    } catch (error) {
        const { userId } = req.params
        const newPayment = new Payment({ createdBy: userId, status: "failed" })
        const pay = await newPayment.save()
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed" });
    }
}


module.exports = cardPayment