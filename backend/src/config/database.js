const mongoose = require("mongoose");

const connectDB = async ()=> {
    await mongoose.connect("mongodb+srv://nuruzzaman31032001:z1HX49YhLgyRJj6n@devtinder.ukoyd.mongodb.net/")
};

module.exports = connectDB;