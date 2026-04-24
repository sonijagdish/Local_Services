import mongoose from "mongoose";

const payoutSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "rejected"],
      default: "pending",
    },
    method: {
      type: String,
      required: true,
    },
    accountDetails: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payout = mongoose.model("Payout", payoutSchema);

export default Payout;
