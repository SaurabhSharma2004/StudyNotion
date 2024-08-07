const mongoose = require('mongoose');
require('dotenv').config();

const connect = async () => {
    await mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("DB Connected Succesfully"))
    .catch((err) => {
        console.log("DB Connection failed");
        console.log(err);
        process.exit(1);
    });
};

module.exports = connect
