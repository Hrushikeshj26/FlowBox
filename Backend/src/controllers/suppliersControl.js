import Suppliers from "../models/Suppliers.js";

export const createSuppliers = async (req, res, next) => {
  try {
    const { name, contact, category, phone } = req.body;

    if (!name || !contact || !category || !phone) {
      return res
        .status(400)
        .json({ message: "Please provide name, email, category, phone..." });
    }

    const newSupplier = await Suppliers.create({
      name,
      contact,
      category,
      phone,
    });

    res.status(200).json({ message: "Supplier Created...", data: newSupplier });
  } catch (err) {
    next(err);
  }
};

export const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Suppliers.find({}).sort({ createdAt: -1 });

    res.status(200).json(suppliers);
  } catch (err) {
    next(err);
  }
};

export const deleteSuppliers = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedSupplier = await Suppliers.findByIdAndDelete(id);

    if (!deletedSupplier) {
      return res.status(404).json({ message: "Supplier Not Found!" });
    }

    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (err) {
    next(err);
  }
};
