const userVerificationEmail = (link) => {
    return `<div style="text-align: center;">
    <h1>Verify Your Email</h1>
    <p>Thank you for signing up, Please verify your email to complete your registration</p>
    <a style="text-align: center;padding: 7px;background-color: black;color: white;border-radius: 4px; text-decoration: none;" href='${process.env.VALIDATIONURL}${link}'>Verify Now</a>
</div>`
}

const userupdateEmail = (link) => {
    return `<div style="text-align: center;">
    <h1>Verify Your Email</h1>
    <p>Please verify your email to complete your update</p>
    <a style="text-align: center;padding: 7px;background-color: black;color: white;border-radius: 4px; text-decoration: none;" href='${process.env.VALIDATIONURL}${link}'>Verify Now</a>
</div>`
}

const userResetEmail = (link) => {
    return `<div style="text-align: center;">
    <h1>Reset Your Password</h1>
    <p>Please click if you want to reset your password within 1 hour</p>
    <a style="text-align: center;padding: 7px;background-color: black;color: white;border-radius: 4px; text-decoration: none;" href='${process.env.RESETURL}${link}'>Reset Password</a>
</div>`
}


module.exports = {
    userVerificationEmail,
    userupdateEmail,
    userResetEmail
}