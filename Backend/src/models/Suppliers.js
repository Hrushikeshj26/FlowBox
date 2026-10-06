import mongoose from "mongoose";

const suppliersSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "others",
  },
  phone: {
    type: String,
    default: 0,
  },
});

const Suppliers = mongoose.model("Suppliers", suppliersSchema);

export default Suppliers;
