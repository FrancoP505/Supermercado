const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { items, total } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'El pedido debe tener al menos un producto' });
    }

    // Verificar stock y disminuir
    for (const item of items) {
      const product = await Product.findById(item.producto_id);
      if (!product || product.stock < item.cantidad) {
        return res.status(400).json({ message: `Stock insuficiente para ${product?.nombre || 'el producto'}` });
      }

      await Product.decreaseStock(item.producto_id, item.cantidad);
    }

    const orderId = await Order.create({
      usuario_id: userId,
      total,
      estado: 'pendiente',
      items
    });

    res.status(201).json({ id: orderId, message: 'Pedido creado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear pedido', error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    const details = await Order.getOrderDetails(req.params.id);
    res.json({ ...order, items: details });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedido', error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findByUserId(req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos', error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { estado } = req.body;
    const validStates = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'];

    if (!validStates.includes(estado)) {
      return res.status(400).json({ message: 'Estado de pedido inválido' });
    }

    await Order.updateStatus(req.params.id, estado);
    res.json({ message: 'Estado del pedido actualizado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar estado', error: error.message });
  }
};