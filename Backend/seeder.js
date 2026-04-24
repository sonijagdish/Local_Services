import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Service from "./models/Service.js";
import Booking from "./models/Booking.js";
import Category from "./models/Category.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Booking.deleteMany();
    await Service.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    const createdUsers = await User.create([
      {
        name: "Admin",
        email: "admin@gmail.com",
        password: "123456",
        role: "admin",
      }
    ]);

    const providerUser = createdUsers[0]._id;

    const createdCategories = await Category.create([
      { name: "cleaning", _id: new mongoose.Types.ObjectId(), isApproved: true },
      { name: "plumbing", _id: new mongoose.Types.ObjectId(), isApproved: true }, 
      { name: "electrician", _id: new mongoose.Types.ObjectId(), isApproved: true }, 
      { name: "painting", _id: new mongoose.Types.ObjectId(), isApproved: true }, 
      { name: "moving", _id: new mongoose.Types.ObjectId(), isApproved: true }, 
      { name: "gardening", _id: new mongoose.Types.ObjectId(), isApproved: true }
    ]);

    const sampleServices = [
      {
        name: "Home Deep Cleaning",
        description: "Professional deep cleaning service for your entire home.",
        category: createdCategories[0]._id,
        price: 1500,
        provider: providerUser,
        isApproved: true
      },
      {
        name: "Electrician",
        description: "Expert electrician for all your home wiring and repairs.",
        category: createdCategories[2]._id,
        price: 500,
        provider: providerUser,
        isApproved: true
      },
      {
        name: "Full House Painting",
        description: "High quality painting service with premium paints.",
        category: createdCategories[3]._id,
        price: 5000,
        provider: providerUser,
        isApproved: true
      },
    ];

    await Service.insertMany(sampleServices);

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Booking.deleteMany();
    await Service.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
