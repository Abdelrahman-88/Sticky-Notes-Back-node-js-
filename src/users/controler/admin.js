const { StatusCodes } = require("http-status-codes");
const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");
const { createUserReport } = require("../../../common/service/createPdf");
const sendEmail = require("../../../common/service/sendEmail");
const { userVerificationEmail, userupdateEmail } = require("../../../common/service/template/userVerification");
const User = require("../model/user.model");
const pageFun = require("../../../common/service/page")
const searchServies = require("../../../common/service/search")

const addAdmin = async(req, res) => {
    try {
        const { name, email, password, cPassword, phone, location } = req.body
        const subject = `Email confirmation`
        const emailExist = await User.findOne({ email, verified: true });
        if (emailExist) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "email already exist" });
        } else {
            if (password === cPassword) {
                const newUser = new User({ name, email, password, phone, location, role: "admin" });
                const data = await newUser.save();
                const token = jwt.sign({ _id: data._id, email: data.email }, process.env.SECRET_KEY, {
                    expiresIn: process.env.TOKEN_EXPIRATION,
                });
                createUserReport("info.pdf", data)
                const info = await sendEmail([email], userVerificationEmail(token), subject)
                if (info.messageId) {
                    const { password, ...rest } = data._doc
                    res.status(StatusCodes.CREATED).json({ message: "done", data: rest });
                } else {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error" });
                }
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "password doesnot match cPassword" });
            }
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "fail to add admin" });
    }
}

const getAllAdmins = async(req, res) => {
    try {
        let { page, size } = req.query
        const { skip, limit, currentPage } = pageFun(page, size)
        const { data, total, totalPages } = await searchServies("admin", "", "", limit, skip, User, ["role"], "", "-password -phone")
        res.status(StatusCodes.OK).json({ message: "done", currentPage, limit, totalPages, total, data })
    } catch (error) {
        res.json({ message: "fail to get all admins" });
    }
}

const deleteAdmin = async(req, res) => {
    try {
        const { id } = req.params
        const user = await User.findOneAndDelete({ _id: id, role: "admin" })
        if (user) {
            res.status(StatusCodes.OK).json({ message: "done" });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "invalid id" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "fail to delete admin" });
    }
}

const updateAdmin = async(req, res) => {
    try {
        const { name, email, phone, location } = req.body
        const { id } = req.params
        if (id == req.user._id) {
            const emailExist = await User.findOne({ email, verified: true });
            const subject = `Email confirmation`
            if (emailExist) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "email already exist" });
            } else {
                let newPhone
                if (phone) {
                    newPhone = CryptoJS.AES.encrypt(phone, process.env.SECRET_KEY).toString();
                }
                if (email) {
                    const data = await User.findOneAndUpdate({ _id: id, role: "admin" }, { name, email, phone: newPhone, location, verified: false }, { new: true });
                    if (data) {
                        const token = jwt.sign({ _id: data._id, email: data.email }, process.env.SECRET_KEY, {
                            expiresIn: process.env.TOKEN_EXPIRATION,
                        });
                        createUserReport("info.pdf", data)
                        const info = await sendEmail([email], userupdateEmail(token), subject)
                        if (info.messageId) {
                            const { password, ...rest } = data._doc
                            res.status(StatusCodes.OK).json({ message: "done", data: rest });
                        } else {
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error" });
                        }
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).json({ message: "invalid id" });
                    }
                } else {
                    const data = await User.findOneAndUpdate({ _id: id, role: "admin" }, { name, email, phone: newPhone, location }, { new: true });
                    if (data) {
                        const { password, ...rest } = data._doc
                        res.status(StatusCodes.OK).json({ message: "done", data: rest });
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).json({ message: "invalid id" });
                    }
                }
            }
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "fail to update admin" });
    }
}


module.exports = {
    addAdmin,
    getAllAdmins,
    deleteAdmin,
    updateAdmin
}