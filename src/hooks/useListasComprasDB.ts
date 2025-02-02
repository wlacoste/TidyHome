import { useState, useEffect } from 'react';
import { IListasCompras } from '../components/ListaCompras/ListaScreen';
import { getDBConnection } from '../service/product-service';
import { ItemCompra } from '../components/ListaComprasGenerada';
import { LayoutAnimation } from 'react-native';
import { formatDate } from '../utils/formatDate';

export const useListasComprasDB = () => {
  const [listas, setListas] = useState<IListasCompras[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await fetchListasCompras();
        setError(null);
      } catch (err) {
        setError('Failed to fetch shopping lists');
        console.error('Error in fetchListasCompras:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const fetchListasCompras = async () => {
    const db = await getDBConnection();

    db.transaction(tx => {
      tx.executeSql(
        `SELECT 
          LC.id, 
          LC.fechaCreacion, 
          LC.titulo, 
          LC.comentario,
          PPL.id as itemId,
          PPL.nombre as item,
          PPL.cantidad
        FROM ListaCompras LC
        LEFT JOIN ProductosPorLista PPL ON LC.id = PPL.idListaCompra
        ORDER BY LC.id DESC, PPL.id`,
        [],
        (_, result) => {
          const rows = result.rows.raw();
          const listasMap = new Map<string, IListasCompras>();

          rows.forEach(row => {
            if (!listasMap.has(row.id.toString())) {
              listasMap.set(row.id.toString(), {
                id: row.id.toString(),
                items: [],
                fecha: row.fechaCreacion,
                titulo: row.titulo,
                comentario: row.comentario,
              });
            }

            const lista = listasMap.get(row.id.toString())!;
            if (row.itemId) {
              lista.items.push({
                id: row.itemId,
                item: row.item,
                cantidad: row.cantidad,
              });
            }
          });

          setListas(Array.from(listasMap.values()));
        },
        error => {
          console.error('Error fetching listas compras:', error);
        },
      );
    });
  };

  // const fetchListas = async () => {
  //   const db = await getDBConnection();

  //   db.transaction(tx => {
  //     tx.executeSql(
  //       'SELECT * FROM ListaCompras ORDER BY fechaCreacion DESC',
  //       [],
  //       (_, { rows }) => {
  //         const fetchedListas: IListasCompras[] = [];
  //         for (let i = 0; i < rows.length; i++) {
  //           const lista = rows.item(i);
  //           fetchedListas.push({
  //             id: lista.id.toString(),
  //             fecha: lista.fechaCreacion,
  //             titulo: lista.titulo,
  //             comentario: lista.comentario,
  //             items: [],
  //           });
  //         }
  //         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

  //         setListas(fetchedListas);
  //         fetchProductosPorLista(fetchedListas);
  //       },
  //       error => {
  //         console.error('Error fetching listas:', error);
  //       },
  //     );
  //   });
  // };

  // const fetchProductosPorLista = async (fetchedListas: IListasCompras[]) => {
  //   const db = await getDBConnection();

  //   db.transaction(tx => {
  //     fetchedListas.forEach(lista => {
  //       tx.executeSql(
  //         'SELECT * FROM ProductosPorLista WHERE idListaCompra = ?',
  //         [lista.id],
  //         (_, { rows }) => {
  //           const items: ItemCompra[] = [];
  //           for (let i = 0; i < rows.length; i++) {
  //             const producto = rows.item(i);
  //             items.push({
  //               id: producto.id,
  //               item: producto.nombre,
  //               cantidad: producto.cantidad,
  //             });
  //           }
  //           lista.items = items;
  //         },
  //         error => {
  //           console.error('Error fetching productos por lista:', error);
  //         },
  //       );
  //     });
  //   });
  //   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

  //   setListas([...fetchedListas]);
  // };

  const handleNewLista = async (items: ItemCompra[]) => {
    const db = await getDBConnection();

    const newList: IListasCompras = {
      id: Date.now().toString(),
      items: items,
      fecha: formatDate(new Date()),
      comentario: '',
      titulo: 'Lista de compras',
    };

    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO ListaCompras (fechaCreacion, titulo, comentario) VALUES (?, ?, ?)',
        [newList.fecha, newList.titulo, newList.comentario],
        (_, { insertId }) => {
          if (insertId) {
            newList.id = insertId.toString();
            items.forEach(item => {
              tx.executeSql(
                'INSERT INTO ProductosPorLista (idListaCompra, nombre, cantidad) VALUES (?, ?, ?)',
                [insertId, item.item, item.cantidad || 1],
              );
            });
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );

            setListas(prev => [newList, ...prev]);
          }
        },
        error => {
          console.error('Error inserting new lista:', error);
        },
      );
    });
  };

  const agregarAlista = async (
    item: string,
    idLista: string,
    cantidad: number = 1,
  ) => {
    const db = await getDBConnection();

    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO ProductosPorLista (idListaCompra, nombre, cantidad) VALUES (?, ?, ?)',
        [idLista, item, cantidad],
        (_, { insertId }) => {
          if (insertId) {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );

            setListas(prev =>
              prev.map(lista =>
                lista.id === idLista
                  ? {
                      ...lista,
                      items: [
                        ...lista.items,
                        { id: insertId, item: item, cantidad: cantidad },
                      ],
                    }
                  : lista,
              ),
            );
          }
        },
        error => {
          console.error('Error adding item to lista:', error);
        },
      );
    });
  };

  const eliminarLista = async (idLista: string) => {
    const db = await getDBConnection();

    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM ListaCompras WHERE id = ?',
        [idLista],
        () => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

          setListas(prev => prev.filter(lista => lista.id !== idLista));
        },
        error => {
          console.error('Error deleting lista:', error);
        },
      );
    });
  };

  const cambiarNombre = async (nombre: string, idLista: string) => {
    const db = await getDBConnection();

    db.transaction(tx => {
      tx.executeSql(
        'UPDATE ListaCompras SET titulo = ? WHERE id = ?',
        [nombre, idLista],
        () => {
          setListas(prev =>
            prev.map(lista =>
              lista.id === idLista ? { ...lista, titulo: nombre } : lista,
            ),
          );
        },
        error => {
          console.error('Error updating lista name:', error);
        },
      );
    });
  };

  return {
    listas,
    handleNewLista,
    agregarAlista,
    eliminarLista,
    cambiarNombre,
    isLoading,
  };
};
