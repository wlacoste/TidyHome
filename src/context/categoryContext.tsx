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
import { Categoria } from '../models/categorias';
import { getDBConnection } from '../service/product-service';

interface CategoryContextType {
  categories: Categoria[];
  addCategory: (category: Omit<Categoria, 'id'>) => Promise<number>;
  updateCategory: (category: Categoria) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  toggleCategoryEnabled: (id: number) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  refreshCategories: () => Promise<void>;
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
  loading: false,
};
export const CategoryContext = createContext<CategoryContextType>(
  defaultCategoryContext,
);

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

export const CategoryProvider: React.FC<CategoryProviderProps> = ({
  children,
}) => {
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
      if (fetchedCategories.length === 0) {
        await resetCategoriesToDefault(database);
        fetchedCategories = await getAllCategories(database);
      }
      setCategories(fetchedCategories);
    }
  };

  const addCategory = async (
    category: Omit<Categoria, 'id'>,
  ): Promise<number> => {
    if (!db) {
      throw new Error('Database not initialized');
    }
    const newCategoryId = await insertCategory(db, category);
    await refreshCategories();
    return newCategoryId;
  };

  const updateCategoryContext = async (category: Categoria): Promise<void> => {
    if (!db) {
      throw new Error('Database not initialized');
    }
    await updateCategory(db, category);
    await refreshCategories();
  };

  const deleteCategoryContext = async (id: number): Promise<void> => {
    if (!db) {
      throw new Error('Database not initialized');
    }
    await deleteCategory(db, id);
    await refreshCategories();
  };

  const toggleCategoryEnabledContext = async (id: number): Promise<void> => {
    if (!db) {
      throw new Error('Database not initialized');
    }
    await toggleCategoryEnabled(db, id);
    await refreshCategories();
  };

  const resetToDefaults = async (): Promise<void> => {
    if (!db) {
      throw new Error('Database not initialized');
    }
    await resetCategoriesToDefault(db);
    await refreshCategories();
  };

  const value = {
    categories,
    addCategory,
    updateCategory: updateCategoryContext,
    deleteCategory: deleteCategoryContext,
    toggleCategoryEnabled: toggleCategoryEnabledContext,
    resetToDefaults,
    refreshCategories: () => refreshCategories(),
    loading,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryProvider;
