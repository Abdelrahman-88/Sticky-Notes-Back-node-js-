const {
    signUp,
    verifyEmail,
    signIn,
    getUser,
    logOut
} = require("../controler/signIn&Up")
const validation = require("../../../common/middelware/validation")
const {
    verifyEmailSchema,
    signInSchema,
    updateUserSchema,
    addUserSchema,
    deactivateUserSchema,
    updatePasswordSchema,
    forgetPasswordSchema,
    resetEmailSchema,
    resetPasswordSchema,
    blockUserSchema,
    addAdminSchema,
    getAllAdminsSchems,
    deleteAdminSchema,
    updateAdminSchema,
    getUserSchema,
    updateEmailSchema,
    logOutSchema
} = require("../validation/user.validation")
const isAuthorized = require("../../../common/middelware/isAuthorized")
const {
    UPDATE_USER,
    DEACTIVATE_USER,
    UPDATE_PASSWORD,
    RESET_PASSWORD,
    BLOCKED_USER,
    ADD_ADMIN,
    GET_ALL_ADMINS,
    DELETE_ADMIN,
    UPDATE_ADMIN,
    GET_USER,
    UPDATE_EMAIL,
    LOGOUT
} = require("../endPoints")
const { addAdmin, getAllAdmins, deleteAdmin, updateAdmin } = require("../controler/admin")
const { blockUser, deactivateUser } = require("../controler/block&deactivate")
const { resetPassword, resetEmail, forgetPassword } = require("../controler/forgetPassword")
const { updatePassword, updateProfile, updateEmail } = require("../controler/update")
const { googleLogin } = require("../controler/googleLogin")
const router = require("express").Router()

router.post("/signUp", validation(addUserSchema), signUp)

router.get("/userActivate/:token", validation(verifyEmailSchema), verifyEmail)

router.post("/signIn", validation(signInSchema), signIn)

router.get("/getUser/:id", validation(getUserSchema), isAuthorized(GET_USER), getUser)

router.post("/googleLogin", googleLogin)

router.patch("/logOut/:id", validation(logOutSchema), isAuthorized(LOGOUT), logOut)

router.put("/updateProfile/:id", validation(updateUserSchema), isAuthorized(UPDATE_USER), updateProfile)

router.patch("/updateEmail/:id", validation(updateEmailSchema), isAuthorized(UPDATE_EMAIL), updateEmail)

router.patch("/updatePassword/:id", validation(updatePasswordSchema), isAuthorized(UPDATE_PASSWORD), updatePassword)

router.post("/forgetPassword", validation(forgetPasswordSchema), forgetPassword)

router.get("/resetEmail/:token", validation(resetEmailSchema), resetEmail)

router.patch("/resetPassword/:id", validation(resetPasswordSchema), isAuthorized(RESET_PASSWORD), resetPassword)

router.patch("/blockUser/:id", validation(blockUserSchema), isAuthorized(BLOCKED_USER), blockUser)

router.patch("/deactivateUser/:id", validation(deactivateUserSchema), isAuthorized(DEACTIVATE_USER), deactivateUser)

router.post("/addAdmin", validation(addAdminSchema), isAuthorized(ADD_ADMIN), addAdmin)

router.get("/getAllAdmins", validation(getAllAdminsSchems), isAuthorized(GET_ALL_ADMINS), getAllAdmins)

router.delete("/deleteAdmin/:id", validation(deleteAdminSchema), isAuthorized(DELETE_ADMIN), deleteAdmin)

router.put("/updateAdmin/:id", validation(updateAdminSchema), isAuthorized(UPDATE_ADMIN), updateAdmin)

module.exports = router