import Settings from "../models/Settings.js";

// GET /api/settings
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to load settings", error });
  }
};

// PUT /api/settings
export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
      await settings.save();
    } else {
      settings = await Settings.findOneAndUpdate(
        { _id: settings._id },
        { $set: req.body },
        { new: true },
      );
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to save settings", error });
  }
};
