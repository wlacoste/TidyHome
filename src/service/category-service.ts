import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { Categoria, DefaultCategories } from '../models/productos';
import { getDBConnection } from './product-service';

export const insertCategory = async (
  db: SQLiteDatabase,
  category: Omit<Categoria, 'id'>,
): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO categories (name, icon, isEnabled) VALUES (?, ?, ?);',
        [category.name, category.icon, category.isEnabled ? 1 : 0],
        (_, result) => {
          console.log('Category inserted successfully', result);
          resolve(result.insertId);
        },
        (_, error) => {
          console.error('Error inserting category: ', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

// Read all categories
export const getAllCategories = async (
  db: SQLiteDatabase,
): Promise<Categoria[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM categories;',
        [],
        (_, result) => {
          const categories: Categoria[] = [];
          for (let i = 0; i < result.rows.length; i++) {
            categories.push({
              id: result.rows.item(i).id,
              name: result.rows.item(i).name,
              icon: result.rows.item(i).icon,
              isEnabled: result.rows.item(i).isEnabled === 1,
            });
          }
          resolve(categories);
        },
        (_, error) => {
          console.error('Error fetching categories: ', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

// Read a single category by ID
export const getCategoryById = async (
  db: SQLiteDatabase,
  id: number,
): Promise<Categoria | null> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM categories WHERE id = ?;',
        [id],
        (_, result) => {
          if (result.rows.length > 0) {
            const item = result.rows.item(0);
            resolve({
              id: item.id,
              name: item.name,
              icon: item.icon,
              isEnabled: item.isEnabled === 1,
            });
          } else {
            resolve(null);
          }
        },
        (_, error) => {
          console.error('Error fetching category: ', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

// Update a category
export const updateCategory = async (
  db: SQLiteDatabase,
  category: Categoria,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE categories SET name = ?, icon = ?, isEnabled = ? WHERE id = ?;',
        [category.name, category.icon, category.isEnabled ? 1 : 0, category.id],
        (_, result) => {
          console.log('Category updated successfully', result);
          resolve();
        },
        (_, error) => {
          console.error('Error updating category: ', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

// Delete a category
export const deleteCategory = async (
  db: SQLiteDatabase,
  id: number,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM categories WHERE id = ?;',
        [id],
        (_, result) => {
          console.log('Category deleted successfully', result);
          resolve();
        },
        (_, error) => {
          console.error('Error deleting category: ', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

// Toggle category enabled status
export const toggleCategoryEnabled = async (
  db: SQLiteDatabase,
  id: number,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE categories SET isEnabled = CASE WHEN isEnabled = 1 THEN 0 ELSE 1 END WHERE id = ?;',
        [id],
        (_, result) => {
          console.log('Category status toggled successfully', result);
          resolve();
        },
        (_, error) => {
          console.error('Error toggling category status: ', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

export const resetCategoriesToDefault = async (
  db: SQLiteDatabase,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // First, delete all existing categories
      tx.executeSql(
        'DELETE FROM categories;',
        [],
        () => {
          console.log('All categories deleted');

          // Reset the auto-increment counter
          tx.executeSql(
            'DELETE FROM sqlite_sequence WHERE name="categories";',
            [],
            () => {
              console.log('Auto-increment counter reset');

              // Insert default categories
              DefaultCategories.forEach(category => {
                tx.executeSql(
                  'INSERT INTO categories (id, name, icon, isEnabled) VALUES (?, ?, ?, ?);',
                  [
                    category.id,
                    category.name,
                    category.icon,
                    category.isEnabled ? 1 : 0,
                  ],
                  () =>
                    console.log(
                      `Default category "${category.name}" re-inserted`,
                    ),
                  (_, error) => {
                    console.error(
                      `Error re-inserting default category "${category.name}":`,
                      error,
                    );
                    return false;
                  },
                );
              });

              resolve();
            },
            (_, error) => {
              console.error('Error resetting auto-increment counter:', error);
              reject(error);
              return false;
            },
          );
        },
        (_, error) => {
          console.error('Error deleting existing categories:', error);
          reject(error);
          return false;
        },
      );
    });
  });
};
