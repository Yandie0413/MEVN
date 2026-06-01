const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri =
      process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017/mevn-online-courses";
    await mongoose.connect(uri);
    console.log("MongoDB connecté");
  } catch (error) {
    console.error("Erreur de connexion MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
