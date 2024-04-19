import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCategories } from 'src/hooks/useCategories';
import { useProductos } from 'src/hooks/useProductos';
import { useUserAuth } from './userAuthContext';
const ProductContext = createContext();

export const ProductContextProvider = ({ children }) => {
  const { user } = useUserAuth();
  const {
    productos,
    error,
    loading,
    getProductos,
    addProducto,
    deleteProducto,
    updateProducto,
  } = useProductos();

  const {
    categorias,
    error: categoriasError,
    loading: categoriasLoading,
    getCategorias,
  } = useCategories();

  const [lastFetched, setLastFetched] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getProductos();
        await getCategorias();
        setLastFetched(Date.now());
        console.log('fetchdata', lastFetched);
      } catch (err) {
        console.log(err);
      }
    };

    if (user && (productos.length === 0 || Date.now() - lastFetched > 60000)) {
      fetchData();
    }
  }, [productos, user, lastFetched]);

  return (
    <ProductContext.Provider
      value={{
        productos,
        error,
        loading,
        getProductos,
        addProducto,
        deleteProducto,
        updateProducto,
        categorias,
        categoriasError,
        categoriasLoading,
        getCategorias,
      }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductoContext = () => useContext(ProductContext);
