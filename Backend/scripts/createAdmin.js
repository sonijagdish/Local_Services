import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js"; // adjust path if needed

const MONGO_URI = "mongodb://localhost:27017/local-service";

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const hashedPassword = await bcrypt.hash("Admin@123", 10).then(console.log);


    const adminExists = await User.findOne({ email: "admin@gmail.com" });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit();
    }

    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully");
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};


// import bcrypt from "bcryptjs";

// const hash = "$2b$10$DH6o1qT2H1f8nmX84rzap.FiEj3SbY12bU2i1JFwMmeK2/SoPvxfq";

// bcrypt.compare("123456", hash).then(console.log);

createAdmin();