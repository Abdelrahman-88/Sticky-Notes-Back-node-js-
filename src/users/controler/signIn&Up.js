const { StatusCodes } = require("http-status-codes");
const sendEmail = require("../../../common/service/sendEmail");
const User = require("../model/user.model");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CryptoJS = require("crypto-js");
const { userVerificationEmail } = require("../../../common/service/template/userVerification");
const { createUserReport } = require("../../../common/service/createPdf");

const signUp = async(req, res) => {
    try {
        let { name, email, password, cPassword, phone, location } = req.body
        email = email.toLowerCase()
        const subject = `Email confirmation`
        const emailExist = await User.findOne({ email, deactivated: false });
        if (emailExist) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Email already exist" });
        } else {
            if (password === cPassword) {
                const newUser = new User({ name, email, password, phone, location });
                const data = await newUser.save();
                const token = jwt.sign({ _id: data._id, email: data.email }, process.env.SECRET_KEY, {
                    expiresIn: process.env.TOKEN_EXPIRATION
                });
                createUserReport("info.pdf", data)
                const info = await sendEmail([email], userVerificationEmail(token), subject)
                if (info.messageId) {
                    const { password, phone, ...rest } = data._doc
                    res.status(StatusCodes.CREATED).json({ message: "done", data: rest });
                } else {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Send verification email error" });
                }
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Password doesnot match cPassword" });
            }
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Fail to signUp" });
    }
}

const verifyEmail = async(req, res) => {
    try {
        const { token } = req.params
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const verify = await User.findOneAndUpdate({ _id: decoded._id, email: decoded.email }, { verified: true })
        if (verify) {
            if (verify.verified) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Email already verified" });
            } else {
                res.status(StatusCodes.OK).json({ message: "Email verified successfully" });
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid user" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Fail to verify email" });
    }
}

const signIn = async(req, res) => {
    try {
        let { email, password } = req.body
        email = email.toLowerCase()
        const emailExist = await User.findOne({ email, deactivated: false, blocked: false });
        if (emailExist) {
            if (emailExist.verified) {
                bcrypt.compare(password, emailExist.password, async function(err, result) {
                    if (err) throw Error(err)
                    if (result) {
                        const data = await User.findByIdAndUpdate({ _id: emailExist.id }, { logedIn: true }, { new: true });
                        const bytes = CryptoJS.AES.decrypt(emailExist.phone, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
                        const { password, phone, ...rest } = emailExist._doc
                        const token = jwt.sign({...rest, phone: bytes }, process.env.SECRET_KEY)
                        res.json({ message: "done", token });
                    } else {
                        res.json({ message: "Invalid email or password" });
                    }
                });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Unverified email" });
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Fail to signIn" });
    }
}

const logOut = async(req, res) => {
    try {
        const { id } = req.params
        if (id == req.user._id) {
            const data = await User.findByIdAndUpdate({ _id: id }, { logedIn: false }, { new: true });
            res.json({ message: "done" });
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Fail to logout" });
    }
}

const getUser = async(req, res) => {
    try {
        const { id } = req.params
        if (id == req.user._id) {
            const user = await User.findOne({ _id: id }).select("-password");
            if (user) {
                const bytes = CryptoJS.AES.decrypt(user.phone, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
                const { phone, ...rest } = user._doc
                res.status(StatusCodes.OK).json({ message: "done", data: {...rest, phone: bytes } });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid id" });
            }
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Fail to get user" });
    }
}




module.exports = {
    signUp,
    verifyEmail,
    signIn,
    getUser,
    logOut
}