const mongoose = require('mongoose');

const dbConnection = () => mongoose.connect(process.env.CONNECTION)
    .then((result) => { console.log("db connected"); })
    .catch((error) => { console.log(error); });

module.exports = dbConnection