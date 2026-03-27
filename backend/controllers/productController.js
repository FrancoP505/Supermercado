const Product = require('../models/Product.js');

exports.getAllProducts = async (req, res) => {
  try {
    const filters = {
      categoria: req.query.categoria,
      search: req.query.search
    };

    const products = await Product.findAll(filters);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener producto', error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria } = req.body;

    if (!nombre || !precio || stock === undefined) {
      return res.status(400).json({ message: 'Campos requeridos: nombre, precio, stock' });
    }

    const result = await Product.create(req.body);
    res.status(201).json({ id: result.insertId, message: 'Producto creado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const result = await Product.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const result = await Product.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
};