import React, { FC, ReactNode, createContext, useContext, useEffect, useState } from 'react';
import {
  IMovimientoSimple,
  IProductoForm,
  MovimientoProducto,
  Producto,
} from '../models/productos';
import {
  deleteProducto,
  getAllProductsWithMovements,
  updateFechaGuardado,
  updateProduct,
} from '../service/product-service';
import useProducto from '../app/producto/useProducto';
import { LayoutAnimation } from 'react-native';
import Toast from 'react-native-toast-message';
import { useCategories } from './categoryContext';

export interface ProductContextTyp {
  productos: Producto[];
  setProductos: React.Dispatch<React.SetStateAction<Producto[]>>;
  agregarProducto: (formu: IProductoForm) => Promise<void>;
  primerMovimiento: (formu: IProductoForm) => Promise<void>;
  agregarMovimiento: (formu: IMovimientoSimple) => Promise<void>;
  eliminarMovimiento: (formu: number) => Promise<void>;
  actualizarProducto: (formu: Producto) => Promise<void>;
  agregarACompraToggle: (formu: Producto) => Promise<void>;
  eliminarProducto: (formu: number) => Promise<void>;
  getProductos: () => Promise<void>;
  loading: boolean;
}

const defaultProductContext: ProductContextTyp = {
  productos: [],
  setProductos: () => {},
  agregarProducto: async () => {},
  agregarMovimiento: async () => {},
  eliminarMovimiento: async () => {},
  primerMovimiento: async () => {},
  actualizarProducto: async () => {},
  agregarACompraToggle: async () => {},
  eliminarProducto: async () => {},
  getProductos: async () => {},

  loading: false,
};

const ProductContext = createContext<ProductContextTyp>(defaultProductContext);

const ProductProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const { categories } = useCategories();
  const [loading, setLoading] = useState(false);

  const {
    nuevoProducto,
    nuevoMovimiento,
    borrarMovimiento,
    primerMovimiento: primerMov,
  } = useProducto();

  const updateProductInArray = (updatedProduct: Producto) => {
    setProductos(prevProducts =>
      prevProducts.map(product => (product.id === updatedProduct.id ? updatedProduct : product)),
    );
  };

  useEffect(() => {
    if (categories.length > 0) {
      setProductos(prevProductos =>
        prevProductos.map(producto => {
          const updatedCategoria = categories.find(cat => cat.id === producto.categoria.id);
          if (updatedCategoria) {
            return {
              ...producto,
              categoria: updatedCategoria,
            };
          }
          return producto;
        }),
      );
    }
  }, [categories]);

  const updateProductoWithMovimiento = (movimiento: MovimientoProducto) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setProductos(prevProductos =>
      prevProductos.map(producto =>
        producto.id === movimiento.idProducto
          ? {
              ...producto,
              detalle: [movimiento, ...producto.detalle.filter(m => m.id !== movimiento.id)],
            }
          : producto,
      ),
    );
  };

  const eliminarProducto = async (id: number) => {
    try {
      await deleteProducto(id);
      await updateFechaGuardado();

      // updateProductInArray(producto);
      setProductos(prevProducts => prevProducts.filter(product => product.id !== id));
      Toast.show({
        type: 'success',
        text1: 'Producto modificado correctamente',
      });
    } catch (e) {
      console.log(e);
      Toast.show({
        type: 'error',
        text1: 'Ocurrio un error al modificar el producto',
      });
    }
  };

  const agregarProducto = async (formu: IProductoForm) => {
    const agregado = await nuevoProducto(formu);

    await updateFechaGuardado();
    if (agregado) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setProductos(prev => [agregado, ...prev]);
    }
  };

  const primerMovimiento = async (formu: IProductoForm) => {
    const agregado = await primerMov(formu);
    if (agregado) {
      updateProductoWithMovimiento(agregado);
    }
  };

  const agregarMovimiento = async (mov: IMovimientoSimple) => {
    const result = await nuevoMovimiento(mov);
    await updateFechaGuardado();
    if (result) {
      updateProductoWithMovimiento(result);
    }
  };

  const actualizarProducto = async (producto: Producto) => {
    try {
      await updateProduct(producto);
      await updateFechaGuardado();
      updateProductInArray(producto);
      Toast.show({
        type: 'success',
        text1: 'Producto modificado correctamente',
      });
    } catch (e) {
      console.log(e);
      Toast.show({
        type: 'error',
        text1: 'Ocurrio un error al modificar el producto',
      });
    }
  };

  const agregarACompraToggle = async (product: Producto) => {
    let producto = {
      ...product,
      agregarListaCompra: !product.agregarListaCompra,
    };
    try {
      await updateProduct(producto);
      await updateFechaGuardado();
      updateProductInArray(producto);
      Toast.show({
        type: 'success',
        text1: producto.agregarListaCompra
          ? `${producto.nombre} marcado para comprar`
          : `${producto.nombre} removido de comprar`,
        text2: producto.agregarListaCompra
          ? 'Se agregará cuando generes una lista nueva de compra'
          : undefined,
      });
    } catch (e) {
      console.log(e);
      Toast.show({
        type: 'error',
        text1: 'Ocurrio un error al modificar el producto',
      });
    }
  };

  const eliminarMovimiento = async (id: number) => {
    const result = await borrarMovimiento(id);
    await updateFechaGuardado();
    if (result) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setProductos(prevProductos =>
        prevProductos.map(producto => ({
          ...producto,
          detalle: producto.detalle.filter(movimiento => movimiento.id !== id),
        })),
      );
    }
  };
  const getProductos = async () => {
    setLoading(true);
    try {
      const p = await getAllProductsWithMovements();
      setProductos(p);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const getProductos = async () => {
      setLoading(true);
      try {
        const p = await getAllProductsWithMovements();
        setProductos(p);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    getProductos();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        productos,
        setProductos,
        agregarProducto,
        agregarMovimiento,
        eliminarMovimiento,
        primerMovimiento,
        loading,
        actualizarProducto,
        agregarACompraToggle,
        eliminarProducto,
        getProductos,
      }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);

export default ProductProvider;
