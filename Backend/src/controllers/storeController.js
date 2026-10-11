import Warehouse from "../models/Store.js";

// @desc    Get all warehouses for logged-in user
// @route   GET /api/warehouses
// @access  Private
export const getWarehouses = async (req, res, next) => {
  try {
    const warehouses = await Warehouse.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(warehouses);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new warehouse for logged-in user
// @route   POST /api/warehouses
// @access  Private
export const createWarehouse = async (req, res, next) => {
  try {
    const { name, location, capacity, currentLoad } = req.body;

    if (!name || !location || !capacity) {
      return res
        .status(400)
        .json({ message: "Name, location, and capacity are required" });
    }

    const warehouse = await Warehouse.create({
      user: req.user._id, // Ties warehouse to the logged-in user
      name,
      location,
      capacity: Number(capacity),
      currentLoad: Number(currentLoad) || 0,
    });

    res.status(201).json(warehouse);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user's warehouse
// @route   DELETE /api/warehouses/:id
// @access  Private
export const deleteWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findOne({
      _id: req.params.id,
      user: req.user._id, // Ensures a user can't delete someone else's warehouse
    });

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    if (warehouse.currentLoad > 0) {
      return res.status(400).json({
        message:
          "Cannot delete warehouse with active stock. Transfer stock first.",
      });
    }

    await warehouse.deleteOne();
    res.json({ message: "Warehouse removed", id: req.params.id });
  } catch (error) {
    next(error);
  }
};
