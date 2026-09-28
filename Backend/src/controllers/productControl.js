import { json } from 'express';
import Product from '../models/Product.js'

export const createProduct = async (req, res) => {
  try {
    const { name, price, stockCount, storeId } = req.body;

    if (!name || !price || !storeId) {
      return res.status(400).json({message: 'Please Provide a name, price and storeID'})
    }

    const newProduct = await Product.create({
      name, price, stockCount: stockCount || 0, storeId
    })

    res.status(201).json({ message: 'Product Created Successfully....', data: newProduct })
  } catch (e) {
    res.status(500).json({message: 'Failed to create product', error: e.message})
  }
}

export const getProduct = async(req, res) => {
  try {
    const products = await Product.find({}).populate('storeId', 'name location');
    res.status(200).json(products)
  } catch (e) {
    res.status(500).json({ message: 'Failed tp fetch Products!', error: e.message })
  }
}
