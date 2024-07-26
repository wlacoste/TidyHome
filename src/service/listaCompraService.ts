import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { ProductoLista, ProductoPorComprar } from '../models/listaCompras';

export async function createListaCompras(
  db: SQLiteDatabase,
  fechaCreacion: string,
): Promise<number> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO ListaCompras (fechaCreacion) VALUES (?)',
        [fechaCreacion],
        (_, result) => {
          console.log('ListaCompras inserted successfully', result);
          resolve(result.insertId);
        },
        (_, error) => {
          console.error('Error inserting ListaCompras: ', error);
          reject(error);
          return false;
        },
      );
    });
  });
}

export async function addProductoToLista(
  db: SQLiteDatabase,
  idListaCompra: number,
  producto: ProductoLista,
): Promise<number> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO ProductosPorLista (idListaCompra, idProducto, cantidad) VALUES (?, ?, ?)',
        [idListaCompra, producto.idProducto, producto.cantidad],
        (_, result) => {
          console.log('Producto added to lista successfully', result);
          resolve(result.insertId);
        },
        (_, error) => {
          console.error('Error adding producto to lista: ', error);
          reject(error);
          return false;
        },
      );
    });
  });
}

export async function addProductoPorComprarToLista(
  db: SQLiteDatabase,
  idListaCompra: number,
  producto: ProductoPorComprar,
): Promise<number> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO ProductosPorLista (idListaCompra, idProducto, cantidad) VALUES (?, NULL, ?)',
        [idListaCompra, producto.cantidad],
        (_, result) => {
          const idProductosPorLista = result.insertId;
          tx.executeSql(
            'INSERT INTO ProductoPorComprar (idProductosPorLista, nombre, cantidad) VALUES (?, ?, ?)',
            [idProductosPorLista, producto.nombre, producto.cantidad],
            (_, result2) => {
              console.log('ProductoPorComprar added successfully', result2);
              resolve(result2.insertId);
            },
            (_, error) => {
              console.error('Error inserting ProductoPorComprar: ', error);
              return false;
            },
          );
        },
        (_, error) => {
          console.error('Error inserting ProductosPorLista: ', error);
          reject(error);
          return false;
        },
      );
    });
  });
}

export async function updateProductoInLista(
  db: SQLiteDatabase,
  idListaCompra: number,
  producto: ProductoLista,
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE ProductosPorLista SET cantidad = ? WHERE idListaCompra = ? AND idProducto = ?',
        [producto.cantidad, idListaCompra, producto.idProducto],
        (_, result) => {
          console.log('Producto in lista updated successfully', result);
          resolve();
        },
        (_, error) => {
          console.error('Error updating producto in lista: ', error);
          reject(error);
          return false;
        },
      );
    });
  });
}

export async function updateProductoPorComprar(
  db: SQLiteDatabase,
  producto: ProductoPorComprar,
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE ProductoPorComprar SET nombre = ?, cantidad = ? WHERE id = ?',
        [producto.nombre, producto.cantidad, producto.id],
        (_, result) => {
          console.log('ProductoPorComprar updated successfully', result);
          resolve();
        },
        (_, error) => {
          console.error('Error updating ProductoPorComprar: ', error);
          reject(error);
          return false;
        },
      );
    });
  });
}

export async function removeProductoFromLista(
  db: SQLiteDatabase,
  idListaCompra: number,
  idProducto: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM ProductosPorLista WHERE idListaCompra = ? AND idProducto = ?',
        [idListaCompra, idProducto],
        (_, result) => {
          console.log('Producto removed from lista successfully', result);
          resolve();
        },
        (_, error) => {
          console.error('Error removing producto from lista: ', error);
          reject(error);
          return false;
        },
      );
    });
  });
}

export async function removeProductoPorComprarFromLista(
  db: SQLiteDatabase,
  id: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT idProductosPorLista FROM ProductoPorComprar WHERE id = ?',
        [id],
        (_, result) => {
          if (result.rows.length > 0) {
            const idProductosPorLista = result.rows.item(0).idProductosPorLista;
            tx.executeSql(
              'DELETE FROM ProductoPorComprar WHERE id = ?',
              [id],
              (_, result2) => {
                tx.executeSql(
                  'DELETE FROM ProductosPorLista WHERE id = ?',
                  [idProductosPorLista],
                  (_, result3) => {
                    console.log(
                      'ProductoPorComprar removed successfully',
                      result3,
                    );
                    resolve();
                  },
                  (_, error) => {
                    console.error('Error removing ProductosPorLista: ', error);
                    return false;
                  },
                );
              },
              (_, error) => {
                console.error('Error removing ProductoPorComprar: ', error);
                return false;
              },
            );
          } else {
            reject(new Error('ProductoPorComprar not found'));
          }
        },
        (_, error) => {
          console.error('Error querying ProductoPorComprar: ', error);
          reject(error);
          return false;
        },
      );
    });
  });
}

export async function deleteListaCompras(
  db: SQLiteDatabase,
  id: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM ListaCompras WHERE id = ?',
        [id],
        (_, result) => {
          console.log('ListaCompras deleted successfully', result);
          resolve();
        },
        (_, error) => {
          console.error('Error deleting ListaCompras: ', error);
          reject(error);
          return false;
        },
      );
    });
  });
}
