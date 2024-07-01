import React, {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { IMovimientoSimple, Producto } from '../models';
import { getAllProductsWithMovements } from '../service/product-service';
import useProducto from '../app/producto/useProducto';
import { IProductoForm } from '../components/ProductForm/ProductForm';
import { LayoutAnimation } from 'react-native';

export interface ProductContextTyp {
  productos: Producto[];
  setProductos: React.Dispatch<React.SetStateAction<Producto[]>>;
  agregarProducto: (formu: IProductoForm) => Promise<void>;
  agregarMovimiento: (formu: IMovimientoSimple) => Promise<void>;
  eliminarMovimiento: (formu: number) => Promise<void>;
}

const defaultProductContext: ProductContextTyp = {
  productos: [],
  setProductos: () => {},
  agregarProducto: async () => {},
  agregarMovimiento: async () => {},
  eliminarMovimiento: async () => {},
};

const ProductContext = createContext<ProductContextTyp>(defaultProductContext);

const ProductProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [productos, setProductos] = useState<Producto[]>([]);

  const { nuevoProducto, nuevoMovimiento, borrarMovimiento } = useProducto();

  const agregarProducto = async (formu: IProductoForm) => {
    const agregado = await nuevoProducto(formu);
    if (agregado) {
      setProductos(prev => [...prev, agregado]);
    }
  };

  const agregarMovimiento = async (mov: IMovimientoSimple) => {
    const result = await nuevoMovimiento(mov);
    if (result) {
      const p = await getAllProductsWithMovements();
      // p.map(a => {
      //   console.log('detalle de ', a.nombre);
      //   console.log('detalle ', a.detalle);
      // });

      setProductos(p);
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
      }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);

export default ProductProvider;
