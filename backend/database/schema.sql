CREATE DATABASE IF NOT EXISTS Supermercado; 

USE Supermercado;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    rol ENUM('cliente', 'admin') DEFAULT 'cliente',
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías (NUEVA)
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos (actualizada con categoria_id)
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    categoria_id INT,
    imagen_url VARCHAR(255),
    estado ENUM('disponible', 'descontinuado') DEFAULT 'disponible',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Tabla de pedidos (actualizada)
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado') DEFAULT 'pendiente',
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla de detalles del pedido (actualizada)
CREATE TABLE detalles_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Tabla de carrito (opcional, para persistencia)
CREATE TABLE carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    UNIQUE KEY unique_user_product (usuario_id, producto_id)
);

-- Tabla de reseñas (opcional)
CREATE TABLE resenas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    usuario_id INT NOT NULL,
    calificacion INT NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
    comentario TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    UNIQUE KEY unique_user_product_review (usuario_id, producto_id)
);

-- Crear índices para optimizar búsquedas
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_detalles_pedido ON detalles_pedido(pedido_id);
CREATE INDEX idx_carrito_usuario ON carrito(usuario_id);

-- Insertar categorías
INSERT INTO categorias (nombre, descripcion) VALUES
('Lácteos', 'Productos lácteos y derivados'),
('Frutas y Verduras', 'Frutas y verduras frescas'),
('Carnes', 'Carnes y productos cárnicos'),
('Bebidas', 'Bebidas diversas'),
('Snacks', 'Alimentos de entre horas');

-- Insertar productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id) VALUES
('Arroz Integral 1kg', 'Arroz integral de alta calidad, nutritivo y sabroso', 2.99, 50, 2),
('Leche Entera 1L', 'Leche fresca de vacas de estancia natural', 3.50, 100, 1),
('Queso Cheddar 500g', 'Queso cheddar maduro y cremoso', 8.99, 30, 1),
('Pollo Entero 1.5kg', 'Pollo fresco, listo para cocinar', 12.99, 25, 3),
('Manzanas Rojas (kg)', 'Manzanas frescas y crujientes', 4.50, 80, 2),
('Tomates (kg)', 'Tomates frescos de la cosecha', 3.25, 60, 2),
('Gaseosa 2L', 'Bebida gaseosa refrescante', 3.99, 150, 4),
('Papas Fritas 200g', 'Papas fritas crujientes sabor natural', 1.99, 200, 5),
('Yogur Natural 500g', 'Yogur natural sin aditivos', 2.75, 40, 1),
('Aceite de Oliva 1L', 'Aceite de oliva virgen extra', 9.99, 20, 5);

SHOW DATABASES;

SHOW TABLES;

DESCRIBE PRODUCTOS;

SELECT * FROM CATEGORIAS;

SELECT p.id, p.nombre, p.precio, p.stock, c.nombre as categoria 
FROM productos p 
LEFT JOIN categorias c ON p.categoria_id = c.id;