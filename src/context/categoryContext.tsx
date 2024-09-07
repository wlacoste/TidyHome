import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import {
  getAllCategories,
  insertCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryEnabled,
  resetCategoriesToDefault,
  updateMultipleCategories,
} from '../service/category-service';
import { Categoria } from '../models/categorias';
import { getDBConnection, updateFechaGuardado } from '../service/product-service';

interface CategoryContextType {
  categories: Categoria[];
  addCategory: (category: Omit<Categoria, 'id'>) => Promise<number>;
  updateCategory: (category: Categoria) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  toggleCategoryEnabled: (id: number) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  updateCategories: (categorias: Categoria[]) => void;
  loading: boolean; // Add this line
}

const defaultCategoryContext: CategoryContextType = {
  categories: [],
  addCategory: async category => 0,
  updateCategory: async category => {},
  deleteCategory: async id => {},
  toggleCategoryEnabled: async id => {},
  resetToDefaults: async () => {},
  refreshCategories: async () => {},
  updateCategories: (categorias: Categoria[]) => {},
  loading: false,
};
export const CategoryContext = createContext<CategoryContextType>(defaultCategoryContext);

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [loading, setLoading] = useState(true); // Add this line

  useEffect(() => {
    const initDB = async () => {
      setLoading(true); // Set loading to true when starting initialization
      try {
        const database = await getDBConnection();
        setDb(database);
        await refreshCategories(database);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      } finally {
        setLoading(false); // Set loading to false when done, regardless of success or failure
      }
    };
    initDB();
  }, []);

  const refreshCategories = async (database: SQLiteDatabase | null = db) => {
    if (database) {
      let fetchedCategories = await getAllCategories(database);
      // if (fetchedCategories.length === 0) {
      //   await resetCategoriesToDefault(database);
      //   fetchedCategories = await getAllCategories(database);
      // }
      setCategories(fetchedCategories);
    }
  };

  const addCategory = async (category: Omit<Categoria, 'id'>): Promise<number> => {
    if (!db) {
      console.log('Database not initialized');
      return 0;
    }
    const newCategoryId = await insertCategory(db, category);
    await updateFechaGuardado();
    await refreshCategories();
    return newCategoryId;
  };

  const updateCategoryContext = async (category: Categoria): Promise<void> => {
    if (!db) {
      return console.log('Database not initialized');
    }
    await updateCategory(db, category);
    await refreshCategories();
  };

  const deleteCategoryContext = async (id: number): Promise<void> => {
    if (!db) {
      return console.log('Database not initialized');
    }
    await deleteCategory(db, id);
    await updateFechaGuardado();
    await refreshCategories();
  };

  const toggleCategoryEnabledContext = async (id: number): Promise<void> => {
    if (!db) {
      return console.log('Database not initialized');
    }
    await toggleCategoryEnabled(db, id);
    await updateFechaGuardado();
    await refreshCategories();
  };

  const resetToDefaults = async (): Promise<void> => {
    if (!db) {
      return console.log('Database not initialized');
    }
    await resetCategoriesToDefault(db);
    await refreshCategories();
  };

  const updateCategories = useCallback(
    async (categorias: Categoria[]) => {
      if (!db) {
        console.error('Database not initialized');
        return;
      }

      try {
        setCategories(categorias);
        await updateMultipleCategories(db, categorias);
        console.log('Categories updated successfully in both state and database');
        await updateFechaGuardado();
      } catch (error) {
        console.error('Error updating categories:', error);
        // Optionally, you might want to revert the state update or show an error message to the user
      }
    },
    [db],
  );

  const value = {
    categories,
    addCategory,
    updateCategory: updateCategoryContext,
    deleteCategory: deleteCategoryContext,
    toggleCategoryEnabled: toggleCategoryEnabledContext,
    resetToDefaults,
    refreshCategories: () => refreshCategories(),
    loading,
    updateCategories,
  };

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
};

export default CategoryProvider;
