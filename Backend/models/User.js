import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "provider", "admin"],
      default: "user",
    },
    // Common profile fields
    phone: { type: String, default: "" },
    bio: { type: String, default: "" },
    skills: { type: String, default: "" },
    profileImage: { type: String, default: "https://via.placeholder.com/150" },
    
    // Provider specific fields
    experience: { type: String, default: "" },
    certifications: { type: String, default: "" },
    workingHoursStart: { type: String, default: "09:00" },
    workingHoursEnd: { type: String, default: "18:00" },
    payoutMethod: { type: String, default: "upi" },
    payoutId: { type: String, default: "" },
    
    isVerified: { type: Boolean, default: false },
    wallet: { type: Number, default: 0 },

    // Password reset fields
    resetPasswordOtp: { type: String },
    resetPasswordOtpExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
