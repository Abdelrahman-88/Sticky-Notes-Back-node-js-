const { Schema } = require("mongoose")
const bcrypt = require('bcrypt');
const CryptoJS = require("crypto-js");


const userSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    phone: String,
    location: String,
    email: { type: String, required: true },
    role: {
        type: String,
        enum: ["user", "admin", "superAdmin"],
        default: "user"

    },
    subscription: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    logedIn: { type: Boolean, default: false },
    forgetPassword: { type: Boolean, default: false }
}, { timestamps: true })

userSchema.pre("save", async function(next) {

    try {
        this.password = await bcrypt.hash(this.password, parseInt(process.env.SALTROUNDS))
        if (this.phone) {
            this.phone = CryptoJS.AES.encrypt(this.phone, process.env.SECRET_KEY).toString();
        }
        next()
    } catch (error) {
        throw new Error(error)
    }

})

module.exports = userSchema