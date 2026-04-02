const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findByUserId(userId);
    res.json(cart || { items: [], total: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener carrito', error: error.message });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { producto_id, cantidad } = req.body;
    const userId = req.user.id;

    if (!producto_id || !cantidad || cantidad <= 0) {
      return res.status(400).json({ message: 'Campos requeridos: producto_id, cantidad' });
    }

    // Verificar que el producto existe
    const product = await Product.findById(producto_id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Verificar stock disponible
    if (product.stock < cantidad) {
      return res.status(400).json({ message: 'Stock insuficiente' });
    }

    const result = await Cart.addItem(userId, producto_id, cantidad);
    res.status(201).json({ message: 'Producto agregado al carrito', itemId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar producto al carrito', error: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { cantidad } = req.body;
    const itemId = req.params.id;
    const userId = req.user.id;

    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ message: 'Cantidad debe ser mayor a 0' });
    }

    const result = await Cart.updateItem(itemId, cantidad, userId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    res.json({ message: 'Cantidad actualizada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar carrito', error: error.message });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.user.id;

    const result = await Cart.removeItem(itemId, userId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    res.json({ message: 'Producto removido del carrito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al remover producto del carrito', error: error.message });
  }
};
