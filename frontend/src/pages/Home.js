import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>🛒 Bienvenido a Supermercado Online</h1>
        <p>Compra tus productos favoritos desde casa</p>
        <Link to="/products" className="btn btn-primary">
          Ver Productos
        </Link>
      </section>

      <section className="features">
        <div className="feature">
          <h3>📦 Envío Rápido</h3>
          <p>Entrega en 24-48 horas</p>
        </div>
        <div className="feature">
          <h3>💳 Pago Seguro</h3>
          <p>Múltiples formas de pago</p>
        </div>
        <div className="feature">
          <h3>✨ Mejor Precio</h3>
          <p>Los mejores precios del mercado</p>
        </div>
      </section>
    </div>
  );
}