import mongoose from "mongoose";

const suppliersSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "others",
  },
  phone: {
    type: Number,
    default: 0,
  },
});

const Suppliers = mongoose.models("Suppliers", suppliersSchema);

export default Suppliers;
