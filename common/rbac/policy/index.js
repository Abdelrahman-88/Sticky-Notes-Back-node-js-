const { ADMIN, USER, superAdmin } = require("../../enum/roles")
const adminPolicy = require("./adminPolicy")
const superAdminPolicy = require("./superAdminPolicy")
const userPolicy = require("./userPolicy")



const option = {
    [ADMIN]: { can: adminPolicy },
    [USER]: { can: userPolicy },
    [superAdmin]: { can: superAdminPolicy }
}

module.exports = option