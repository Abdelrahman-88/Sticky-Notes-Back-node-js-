const RBAC = require("easy-rbac")
const option = require("./policy/index")
const rbac = RBAC.create(option)

module.exports = rbac