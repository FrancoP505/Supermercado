const bcrypt = require('bcryptjs');
const pool = require('../config/database');

class User {
  static async create(userData) {
    const { nombre, email, password, telefono } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO usuarios (nombre, email, password, telefono) VALUES (?, ?, ?, ?)';
    const [result] = await pool.execute(query, [nombre, email, hashedPassword, telefono]);
    
    return result;
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    const [rows] = await pool.execute(query, [email]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, nombre, email, telefono, fecha_registro FROM usuarios WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }

  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async update(id, userData) {
    const { nombre, telefono } = userData;
    const query = 'UPDATE usuarios SET nombre = ?, telefono = ? WHERE id = ?';
    const [result] = await pool.execute(query, [nombre, telefono, id]);
    return result;
  }
}

module.exports = User;