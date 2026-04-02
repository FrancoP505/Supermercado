import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext.js';

export default function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const { user } = useContext(AuthContext);

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      alert('No hay suficiente stock');
      return;
    }
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {product.imagen_url ? (
          <img src={product.imagen_url} alt={product.nombre} />
        ) : (
          <div className="placeholder-image">📦</div>
        )}
      </div>

      <div className="product-info">
        <h3>{product.nombre}</h3>
        <p className="description">{product.descripcion}</p>
        
        <div className="price-stock">
          <span className="price">${product.precio}</span>
          <span className="stock">Stock: {product.stock}</span>
        </div>

        {product.stock > 0 ? (
          <div className="product-actions">
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="quantity-input"
            />
            <button 
              onClick={handleAddToCart}
              className="btn btn-add-cart"
            >
              🛒 Agregar al Carrito
            </button>
          </div>
        ) : (
          <p className="out-of-stock">Sin stock disponible</p>
        )}
      </div>
    </div>
  );
}