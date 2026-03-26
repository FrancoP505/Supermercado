import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import ProductCard from '../components/ProductCard.js';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('');

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="products-page">
      <h1>Nuestros Productos</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Todas las categorías</option>
          <option value="Lácteos">Lácteos</option>
          <option value="Frutas y Verduras">Frutas y Verduras</option>
          <option value="Carnes">Carnes</option>
          <option value="Bebidas">Bebidas</option>
          <option value="Snacks">Snacks</option>
        </select>
      </div>

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="products-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p>No hay productos disponibles</p>
          )}
        </div>
      )}
    </div>
  );
}