import mongoose from "mongoose";

const promotionSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["percentage", "flat"],
      default: "percentage",
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Promotion = mongoose.model("Promotion", promotionSchema);

export default Promotion;
