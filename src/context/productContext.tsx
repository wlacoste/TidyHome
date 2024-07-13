import React, {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  IMovimientoSimple,
  IProductoForm,
  MovimientoProducto,
  Producto,
} from '../models/productos';
import { getAllProductsWithMovements } from '../service/product-service';
import useProducto from '../app/producto/useProducto';
import { LayoutAnimation } from 'react-native';

export interface ProductContextTyp {
  productos: Producto[];
  setProductos: React.Dispatch<React.SetStateAction<Producto[]>>;
  agregarProducto: (formu: IProductoForm) => Promise<void>;
  primerMovimiento: (formu: IProductoForm) => Promise<void>;
  agregarMovimiento: (formu: IMovimientoSimple) => Promise<void>;
  eliminarMovimiento: (formu: number) => Promise<void>;
}

const defaultProductContext: ProductContextTyp = {
  productos: [],
  setProductos: () => {},
  agregarProducto: async () => {},
  agregarMovimiento: async () => {},
  eliminarMovimiento: async () => {},
  primerMovimiento: async () => {},
};

const ProductContext = createContext<ProductContextTyp>(defaultProductContext);

const ProductProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [productos, setProductos] = useState<Producto[]>([]);

  const {
    nuevoProducto,
    nuevoMovimiento,
    borrarMovimiento,
    primerMovimiento: primerMov,
  } = useProducto();

  const updateProductoWithMovimiento = (movimiento: MovimientoProducto) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setProductos(prevProductos =>
      prevProductos.map(producto =>
        producto.id === movimiento.idProducto
          ? {
              ...producto,
              detalle: [
                movimiento,
                ...producto.detalle.filter(m => m.id !== movimiento.id),
              ],
            }
          : producto,
      ),
    );
  };

  const agregarProducto = async (formu: IProductoForm) => {
    const agregado = await nuevoProducto(formu);
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
    if (result) {
      updateProductoWithMovimiento(result);

      // const p = await getAllProductsWithMovements();

      // setProductos(p);
    }
  };

  const eliminarMovimiento = async (id: number) => {
    const result = await borrarMovimiento(id);
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

  useEffect(() => {
    const getProductos = async () => {
      const p = await getAllProductsWithMovements();
      setProductos(p);
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
      }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);

export default ProductProvider;
