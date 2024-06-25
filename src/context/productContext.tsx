import React, {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Producto } from '../models';
import { getAllProductsWithMovements } from '../service/product-service';
import useProducto from '../app/producto/useProducto';
import { IProductoForm } from '../components/ProductForm/ProductForm';

export interface ProductContextTyp {
  productos: Producto[];
  setProductos: React.Dispatch<React.SetStateAction<Producto[]>>;
  agregarProducto: (formu: IProductoForm) => Promise<void>;
}

const defaultProductContext: ProductContextTyp = {
  productos: [],
  setProductos: () => {},
  agregarProducto: async () => {},
};

const ProductContext = createContext<ProductContextTyp>(defaultProductContext);

const ProductProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [productos, setProductos] = useState<Producto[]>([]);

  const { nuevoProducto } = useProducto();

  const agregarProducto = async (formu: IProductoForm) => {
    const agregado = await nuevoProducto(formu);
    if (agregado) {
      setProductos(prev => [...prev, agregado]);
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
      value={{ productos, setProductos, agregarProducto }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);

export default ProductProvider;
