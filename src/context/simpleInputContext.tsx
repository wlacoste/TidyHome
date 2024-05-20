import React, {
  createContext,
  useState,
  FC,
  ReactNode,
  useContext,
} from 'react';

import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';
import { useStorage } from './useStorage';

export interface ProductContextType {
  products: string[] | any;
  setProducts: any;
}

const SimpleInputContext = createContext<ProductContextType | undefined>(
  undefined,
);

const InputProvider: FC<{ children: ReactNode }> = ({ children }) => {
  //   const [products, setProducts] = useState<string[]>([]);
  const [products, setProducts] = useStorage('products', []);

  return (
    <SimpleInputContext.Provider value={{ products, setProducts }}>
      {children}
    </SimpleInputContext.Provider>
  );
};

// Custom hook for consuming the context
const useSimpleInput = () => {
  const context = useContext(SimpleInputContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export { InputProvider, useSimpleInput };
