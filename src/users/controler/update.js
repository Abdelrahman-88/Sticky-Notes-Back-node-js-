const { StatusCodes } = require("http-status-codes");
const User = require("../model/user.model");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CryptoJS = require("crypto-js");
const { createUserReport } = require("../../../common/service/createPdf");
const sendEmail = require("../../../common/service/sendEmail");
const { userupdateEmail } = require("../../../common/service/template/userVerification");

exports.updateProfile = async(req, res) => {
    try {
        const { name, phone, location } = req.body
        const { id } = req.params
        let newPhone = CryptoJS.AES.encrypt(phone, process.env.SECRET_KEY).toString();
        if (id == req.user._id) {
            const data = await User.findByIdAndUpdate({ _id: id }, { name, phone: newPhone, location }, { new: true });
            const bytes = CryptoJS.AES.decrypt(data.phone, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
            const { password, phone, ...rest } = data._doc
            const token = jwt.sign({...rest, phone: bytes }, process.env.SECRET_KEY)
            res.json({ message: "done", token });
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Fail to update profile" });
    }
}

exports.updateEmail = async(req, res) => {
    try {
        let { email } = req.body
        email = email.toLowerCase()
        const { id } = req.params
        if (id == req.user._id) {
            const emailExist = await User.findOne({ email, deactivated: false });
            const subject = `Email confirmation`
            if (emailExist) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Email already exist" });
            } else {
                const data = await User.findByIdAndUpdate({ _id: id }, { email, verified: false, logedIn: false }, { new: true });

                const token = jwt.sign({ _id: data._id, email: data.email }, process.env.SECRET_KEY, {
                    expiresIn: process.env.TOKEN_EXPIRATION
                });
                createUserReport("info.pdf", data)
                const info = await sendEmail([email], userupdateEmail(token), subject)
                if (info.messageId) {
                    res.json({ message: "done" });
                } else {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Send verification email error" });
                }
            }
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Fail to update email" });
    }
}

exports.updatePassword = async(req, res) => {
    try {
        const { oldPassword, newPassword, cNewPassword } = req.body
        const { id } = req.params
        if (id == req.user._id) {
            const user = await User.findOne({ _id: id });
            if (user) {
                bcrypt.compare(oldPassword, user.password, async function(err, result) {
                    if (err) throw Error(err)
                    if (result) {
                        if (newPassword === cNewPassword) {
                            const hashPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALTROUNDS))
                            const data = await User.findByIdAndUpdate({ _id: id }, { password: hashPassword });
                            res.status(StatusCodes.OK).json({ message: "done" });
                        } else {
                            res.status(StatusCodes.BAD_REQUEST).json({ message: "Password doesnot match cPassword" });
                        }
                    } else {
                        res.json({ message: "Invalid old password" });
                    }
                });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid id" });
            }
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Fail to update password" });
    }
}