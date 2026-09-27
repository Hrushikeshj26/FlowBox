import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trime: true
    },
    location: {
      type: String,
      require: true
    },
  },
  { timestamps: true }
)

const Store = mongoose.model('Store', storeSchema);
export default Store;
