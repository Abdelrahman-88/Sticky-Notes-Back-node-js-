const { StatusCodes } = require("http-status-codes");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUserReport } = require("../../../common/service/createPdf");
const sendEmail = require("../../../common/service/sendEmail");
const { userResetEmail } = require("../../../common/service/template/userVerification");
const User = require("../model/user.model");

exports.forgetPassword = async(req, res) => {
    try {
        const subject = "Reset password"
        const { email } = req.body
        const data = await User.findOne({ email, verified: true, deactivated: false, blocked: false })
        if (data) {
            const token = jwt.sign({ _id: data._id }, process.env.SECRET_KEY, {
                expiresIn: process.env.TOKEN_RESET_EXPIRATION,
            });
            createUserReport("info.pdf", data)
            const info = await sendEmail([email], userResetEmail(token), subject)
            if (info.messageId) {
                const { password, ...rest } = data._doc
                res.status(StatusCodes.OK).json({ message: "done" });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error" });
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid email" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Fail to forget password" });
    }
}

exports.resetEmail = async(req, res) => {
    try {
        const { token } = req.params
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const reset = await User.findByIdAndUpdate({ _id: decoded._id }, { forgetPassword: true })
        if (reset) {
            res.status(StatusCodes.OK).json({ message: "Password reseted successfully", token });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid id" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Fail to reset email" });
    }
}

exports.resetPassword = async(req, res) => {
    try {
        const { newPassword, cNewPassword } = req.body
        const { id } = req.params
        if (id == req.user._id) {
            if (newPassword === cNewPassword) {
                const hashPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALTROUNDS))
                const data = await User.findOneAndUpdate({ _id: id, forgetPassword: true }, { password: hashPassword, forgetPassword: false });
                if (data) {
                    res.status(StatusCodes.OK).json({ message: "done" });
                } else {
                    res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
                }
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Password doesnot match cPassword" });
            }
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Fail to reset password" });
    }
}