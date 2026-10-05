import mongoose from "mongoose";

const storeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a warehouse name"],
    },
    location: {
      type: String,
      required: [true, "Please add a location"],
    },
    capacity: {
      type: Number,
      required: [true, "Please add the maximum capacity"],
      default: 0,
    },
    currentLoad: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Store = mongoose.model("Store", storeSchema);
export default Store;
