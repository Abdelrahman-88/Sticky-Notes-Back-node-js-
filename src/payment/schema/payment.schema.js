const { Schema } = require("mongoose")


const paymentSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    amount: { type: Number, required: true, default: 15 },
    status: {
        type: String,
        enum: ["successed", "failed"]
    }
}, { timestamps: true })


module.exports = paymentSchema;