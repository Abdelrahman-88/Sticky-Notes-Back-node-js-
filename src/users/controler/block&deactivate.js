const { StatusCodes } = require("http-status-codes");
const User = require("../model/user.model");

exports.blockUser = async(req, res) => {
    try {
        const { id } = req.params
        const user = await User.findOneAndUpdate({ _id: id, blocked: false, deactivated: false }, { blocked: true })
        if (user) {
            res.status(StatusCodes.OK).json({ message: "done" });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "invalid id" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "fail to block user" });
    }
}

exports.deactivateUser = async(req, res) => {
    try {
        const { id } = req.params
        if (id == req.user._id) {
            const user = await User.findOneAndUpdate({ _id: id, deactivated: false }, { deactivated: true })
            if (user) {
                res.status(StatusCodes.OK).json({ message: "done" });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid user" });
            }
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Fail to deactivate user" });
    }
}