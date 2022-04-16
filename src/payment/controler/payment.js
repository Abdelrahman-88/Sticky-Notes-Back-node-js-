const { StatusCodes } = require("http-status-codes");
const pageFun = require("../../../common/service/page");
const Payment = require("../model/payment.model");
const searchServies = require("../../../common/service/search")

const userPayment = async(req, res) => {
    try {
        const { userId } = req.params
        if (userId == req.user._id) {
            let { page, size } = req.query
            const { skip, limit, currentPage } = pageFun(page, size)
            const { data, total, totalPages } = await searchServies("", "createdBy", userId, limit, skip, Payment, [], "createdBy", "-password -phone")
            res.status(StatusCodes.OK).json({ message: "done", currentPage, limit, totalPages, total, data })
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to get payments" });
    }
}


module.exports = userPayment