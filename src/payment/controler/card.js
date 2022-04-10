const stripe = require('stripe')(process.env.SECRET_kEY_API);
const { StatusCodes } = require('http-status-codes');
const { nanoid } = require("nanoid");


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
            .then((result) => {
                res.status(StatusCodes.CREATED).json({ message: "done" });
            })
            .catch((err) => {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed" });
            });

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed" });

    }
}


module.exports = cardPayment