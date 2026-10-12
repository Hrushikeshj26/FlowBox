import Suppliers from "../models/Suppliers.js";

// CREATE SUPPLIER FOR LOGGED-IN USER
export const createSuppliers = async (req, res) => {
  try {
    const { name, contact, category, phone } = req.body;

    if (!name || !contact || !category || !phone) {
      return res
        .status(400)
        .json({ message: "Please provide name, email, category, phone..." });
    }

    const newSupplier = await Suppliers.create({
      user: req.user._id, // Link supplier to logged-in user
      name,
      contact,
      category,
      phone,
    });

    res.status(201).json({ message: "Supplier Created...", data: newSupplier });
  } catch (err) {
    console.error("Create Supplier Error:", err);
    res
      .status(500)
      .json({ message: "Failed to create supplier", error: err.message });
  }
};

// GET ALL SUPPLIERS FOR LOGGED-IN USER
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Suppliers.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(suppliers);
  } catch (err) {
    console.error("Get Suppliers Error:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch suppliers", error: err.message });
  }
};

// DELETE SUPPLIER (Scoped to logged-in user)
export const deleteSuppliers = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSupplier = await Suppliers.findOneAndDelete({
      _id: id,
      user: req.user._id, // Ensure user owns this supplier
    });

    if (!deletedSupplier) {
      return res.status(404).json({ message: "Supplier Not Found!" });
    }

    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (err) {
    console.error("Delete Supplier Error:", err);
    res
      .status(500)
      .json({ message: "Failed to delete supplier", error: err.message });
  }
};
