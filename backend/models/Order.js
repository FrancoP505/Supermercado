const pool = require('../config/database');

class Order {
  static async create(orderData) {
    const { usuario_id, total, estado, items } = orderData;
    
    const queryOrder = 'INSERT INTO pedidos (usuario_id, total, estado) VALUES (?, ?, ?)';
    const [orderResult] = await pool.execute(queryOrder, [usuario_id, total, estado || 'pendiente']);

    const orderId = orderResult.insertId;

    // Insertar items del pedido
    for (const item of items) {
      const queryItem = 'INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)';
      await pool.execute(queryItem, [orderId, item.producto_id, item.cantidad, item.precio_unitario]);
    }

    return orderId;
  }

  static async findById(id) {
    const query = `
      SELECT p.*, u.nombre, u.email FROM pedidos p
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }

  static async findByUserId(userId) {
    const query = `
      SELECT * FROM pedidos 
      WHERE usuario_id = ? 
      ORDER BY fecha_pedido DESC
    `;
    const [rows] = await pool.execute(query, [userId]);
    return rows;
  }

  static async getOrderDetails(orderId) {
    const query = `
      SELECT dp.*, pr.nombre, pr.imagen_url FROM detalles_pedido dp
      JOIN productos pr ON dp.producto_id = pr.id
      WHERE dp.pedido_id = ?
    `;
    const [rows] = await pool.execute(query, [orderId]);
    return rows;
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE pedidos SET estado = ? WHERE id = ?';
    const [result] = await pool.execute(query, [status, id]);
    return result;
  }

  static async getAll() {
    const query = 'SELECT * FROM pedidos ORDER BY fecha_pedido DESC';
    const [rows] = await pool.execute(query);
    return rows;
  }
}

module.exports = Order;