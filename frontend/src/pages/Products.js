import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api.js';
import ProductCard from '../components/ProductCard.js';
import { AuthContext } from '../context/authContext.js';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('');
  const [cart, setCart] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProducts();
  }, [search, categoria]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (categoria) params.categoria = categoria;

      const res = await api.get('/products', { params });
      setProducts(res.data);
    } catch (err) {
      console.error('Error al obtener productos:', err);
      alert('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product, quantity) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, cantidad: item.cantidad + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, cantidad: quantity }]);
    }
    
    alert(`${product.nombre} agregado al carrito`);
    // Guardar en localStorage para persistencia
    localStorage.setItem('cart', JSON.stringify([...cart, { ...product, cantidad: quantity }]));
  };

  return (
    <div className="products-container">
      <h1>🛍️ Nuestros Productos</h1>

      <div className="search-filters">
        <input
          type="text"
          placeholder="🔍 Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select 
          value={categoria} 
          onChange={(e) => setCategoria(e.target.value)}
          className="category-select"
        >
          <option value="">Todas las categorías</option>
          <option value="Lácteos">Lácteos</option>
          <option value="Frutas y Verduras">Frutas y Verduras</option>
          <option value="Carnes">Carnes</option>
          <option value="Bebidas">Bebidas</option>
          <option value="Snacks">Snacks</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">⏳ Cargando productos...</div>
      ) : products.length > 0 ? (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="no-products">
          <p>📦 No hay productos disponibles</p>
          <p className="secondary-text">Intenta cambiar tus filtros de búsqueda</p>
        </div>
      )}

      {user?.role === 'admin' && (
        <div className="admin-section">
          <button className="btn btn-admin">➕ Agregar Nuevo Producto</button>
        </div>
      )}
    </div>
  );
}