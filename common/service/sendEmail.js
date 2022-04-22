const nodemailer = require("nodemailer");
module.exports = async(listEmail, content, subject) => {
    let transporter = nodemailer.createTransport({
        service: "Hotmail",
        auth: {
            user: process.env.SENDER, // generated ethereal user
            pass: process.env.SENDER_PASS, // generated ethereal password
        },
    });
    try {
        let info = await transporter.sendMail({
            from: `${subject} < ${process.env.SENDER} >`, // sender address
            to: listEmail.join(","), // list of receivers
            subject: subject, // Subject line
            text: subject, // plain text body
            html: content, // html body
            attachments: [{
                filename: 'info.pdf',
                path: 'info.pdf',
                contentType: 'info/pdf'
            }]
        });
        return info;
    } catch (error) {
        throw new Error(error)
    }
};