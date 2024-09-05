import { useCallback, useEffect, useState } from 'react';
import { getDBConnection } from '../service/product-service';
import { LayoutAnimation } from 'react-native';

export interface ITodoItem {
  id: number;
  tituloNota: string;
  fechaNota: string;
  nota: string;
}

export const useTodoItemCrud = () => {
  const [todoItems, setTodoItems] = useState<ITodoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noItems, setNoItems] = useState(false);

  const fetchAllTodoItems = useCallback(async () => {
    const db = await getDBConnection();

    return new Promise<void>((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM TodoItem ORDER BY id DESC',
          [],
          (_, { rows }) => {
            const items = rows.raw();
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );
            setTodoItems(items);
            setNoItems(items.length === 0);
            resolve();
          },
          error => {
            console.error('Error fetching TodoItems:', error);
            reject(error);
          },
        );
      });
    });
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await fetchAllTodoItems();
        setError(null);
      } catch (err) {
        setError('Failed to fetch todo list');
        console.error('Error in fetch todo list:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const addTodoItem = useCallback(
    async (tituloNota, fechaNota, nota) => {
      const db = await getDBConnection();

      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO TodoItem (tituloNota, fechaNota, nota) VALUES (?, ?, ?)',
          [tituloNota, fechaNota, nota],
          (_, { insertId }) => {
            console.log('TodoItem added successfully with id:', insertId);
            fetchAllTodoItems();
          },
          error => console.error('Error adding TodoItem:', error),
        );
      });
    },
    [fetchAllTodoItems],
  );

  const updateTodoItem = useCallback(
    async (id, tituloNota, fechaNota, nota) => {
      const db = await getDBConnection();

      db.transaction(tx => {
        tx.executeSql(
          'UPDATE TodoItem SET tituloNota = ?, fechaNota = ?, nota = ? WHERE id = ?',
          [tituloNota, fechaNota, nota, id],
          () => {
            console.log('TodoItem updated successfully');
            fetchAllTodoItems();
          },
          error => console.error('Error updating TodoItem:', error),
        );
      });
    },
    [fetchAllTodoItems],
  );

  const deleteTodoItem = useCallback(
    async id => {
      const db = await getDBConnection();

      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM TodoItem WHERE id = ?',
          [id],
          () => {
            console.log('TodoItem deleted successfully');
            fetchAllTodoItems();
          },
          error => console.error('Error deleting TodoItem:', error),
        );
      });
    },
    [fetchAllTodoItems],
  );

  return {
    todoItems,
    addTodoItem,
    updateTodoItem,
    deleteTodoItem,
    fetchAllTodoItems,
    isLoading,
    noItems,
  };
};
