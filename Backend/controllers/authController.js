import bcrypt from "bcryptjs";
import User from "./models/User.js";

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash("123456", 10);

  await User.create({
    name: "Admin",
    email: "admin@gmail.com",
    password: hashedPassword,
    role: "admin"
  });

  console.log("Admin created");
};

createAdmin();
