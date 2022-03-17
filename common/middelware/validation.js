const { StatusCodes } = require("http-status-codes")
const headerMethod = ["body", "params", "query"]
module.exports = (schema) => {
    return async(req, res, next) => {
        let validation = []
        headerMethod.forEach((key) => {
            if (schema[key]) {
                const { error } = schema[key].validate(req[key]);
                if (error) {
                    validation.push(error.details[0])
                }
            }

        })

        if (validation.length) {
            console.log(validation);
            res.status(StatusCodes.BAD_REQUEST).json({ message: "validation error", error: validation })

        } else {
            next()
        }

    }
}