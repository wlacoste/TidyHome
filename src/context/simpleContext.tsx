import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import {
  getAllCategories,
  insertCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryEnabled,
  resetCategoriesToDefault,
} from '../service/category-service';
import { Categoria } from '../models/productos';
import { getDBConnection } from '../service/product-service';

interface SimpleContextType {
  texto: string;
}

const simpleContext: SimpleContextType = {
  texto: 'texto simple invalido',
};
const SimpleContext = createContext<SimpleContextType>(simpleContext);

export const useSimpleContext = () => {
  const context = useContext(SimpleContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

interface CategoryProviderProps {
  children: ReactNode;
}

export const SimpleProvider: React.FC<CategoryProviderProps> = ({
  children,
}) => {
  const [texto, setTexto] = useState('primer texto valido');

  const value = {
    texto,
  };

  return (
    <SimpleContext.Provider value={value}>{children}</SimpleContext.Provider>
  );
};

export default SimpleProvider;
