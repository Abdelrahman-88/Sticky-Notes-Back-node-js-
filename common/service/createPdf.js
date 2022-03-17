const fs = require("fs");
const PDFDocument = require("pdfkit");

function createUserReport(path, user) {
    let doc = new PDFDocument({ size: "A4", margin: 50 });

    generateHeader(doc);
    generateCustomerInformation(doc, );
    generateInvoiceTable(doc, user);
    generateFooter(doc);

    doc.end();
    doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
    doc
        .image("logo.png", 50, 45, { width: 50 })
        .fillColor("#444444")
        .fontSize(20)
        .text("Notes", 110, 57)
        .fontSize(10)
        .text("Notes", 200, 50, { align: "right" })
        .text("Egypt", 200, 65, { align: "right" })
        .text("Cairo", 200, 80, { align: "right" })
        .moveDown();
}

function generateCustomerInformation(doc) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("User info", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;


}

async function generateInvoiceTable(doc, user) {

    const invoiceTableTop = 200;

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Name",
        "Email",
        "Role",
        "Verified",
        "CreatedAt"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    const position = invoiceTableTop + 30;
    const date = new Date(user.createdAt).toLocaleDateString()
    generateTableRow(
        doc,
        position,
        user.name,
        user.email,
        user.role,
        user.verified,
        date
    );

    generateHr(doc, position + 20);


}

function generateFooter(doc) {
    doc
        .fontSize(10)
        .text(
            "Thank you for your business.",
            50,
            780, { align: "center", width: 500 }
        );
}

function generateTableRow(
    doc,
    y,
    name,
    email,
    role,
    verified,
    createdAt
) {
    doc
        .fontSize(10)
        .text(name, 50, y)
        .text(email, 150, y)
        .text(role, 280, y, { width: 90, align: "right" })
        .text(verified, 370, y, { width: 90, align: "right" })
        .text(createdAt, 0, y, { align: "right" });
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}


module.exports = {
    createUserReport
};