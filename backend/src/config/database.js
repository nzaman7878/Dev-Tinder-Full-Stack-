const mongoose = require("mongoose");

const connectDB = async ()=> {
    await mongoose.connect("mongodb+srv://nuruzzaman31032001:TFUGHGcWuq5N0EJR@devtinder.ukoyd.mongodb.net/");
};

module.exports = connectDB;