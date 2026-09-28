import Store from "../models/Store.js";

export const createStore = async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name || !location) {
      return res.status(400).json({message: 'Please provide both a name and a location'})
    }

    const newStore = await Store.create({
      name, location
    })
    res.status(201).json(newStore)
  } catch (e) {
    res.status(500).json({message: 'Failed to create store!', error: e.message})
  }
}

export const getStore = async (req, res) => {
  try {
    const store = await Store.find({});
    res.status(200).json(store)
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch stores', error: e.message})
  }
}
