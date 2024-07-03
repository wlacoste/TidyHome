import {
  SQLiteDatabase,
  enablePromise,
  openDatabase,
} from 'react-native-sqlite-storage';
import { IProducto, MovimientoProducto, Producto } from '../models';

export const getDBConnection = async () => {
  return openDatabase({ name: 'cleanApp.db', location: 'default' });
};

enablePromise(true);

export const tableExists = async (tableName: string): Promise<boolean> => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
        [tableName],
        (_, result) => {
          resolve(result.rows.length > 0);
        },
        (_, error) => {
          reject(error);
          return false;
        },
      );
    });
  });
};

export const createTables = async () => {
  const existen = await tableExists('productos');
  if (existen) {
    return;
  }
  const db = await getDBConnection();

  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS productos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT,
          categoria TEXT,
          fechaCreacion TEXT
        );`,
      [],
      () => {
        console.log('Products table created successfully');
      },
      error => {
        console.error('Error creating products table: ', error);
      },
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS movimiento_producto (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_id INTEGER,
          fechaCreacion TEXT,
          precio REAL,
          cantidad INTEGER,
          isUnitario INTEGER,
          precioUnitario REAL,
          isVence INTEGER,
          fechaVencimiento string,
          isCompra INTEGER,
          FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
        );`,
      [],
      () => {
        console.log('Bought dates table created successfully');
      },
      error => {
        console.error('Error creating bought dates table: ', error);
      },
    );
  });
};

export const getAllProductsWithMovements = async (): Promise<Producto[]> => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT p.*, mp.id as mp_id, mp.fechaCreacion as mp_fechaCreacion, 
                mp.precio, mp.cantidad, mp.isUnitario, mp.precioUnitario, 
                mp.isVence, mp.fechaVencimiento, mp.isCompra
         FROM productos p
         INNER JOIN movimiento_producto mp ON p.id = mp.product_id
         ORDER BY p.nombre, mp.id DESC`,
        [],
        (_, results) => {
          const productos: Producto[] = [];
          let currentProducto: Producto | null = null;

          for (let i = 0; i < results.rows.length; i++) {
            const row = results.rows.item(i);

            if (!currentProducto || currentProducto.id !== row.id) {
              if (currentProducto) {
                productos.push(currentProducto);
              }
              currentProducto = {
                id: row.id,
                nombre: row.nombre,
                categoria: row.categoria,
                fechaCreacion: row.fechaCreacion,
                detalle: [],
              };
            }

            currentProducto.detalle.push({
              id: row.mp_id,
              idProducto: row.id,
              fechaCreacion: row.mp_fechaCreacion,
              precio: row.precio,
              cantidad: row.cantidad,
              isUnitario: Boolean(row.isUnitario),
              precioUnitario: row.precioUnitario,
              isVence: Boolean(row.isVence),
              fechaVencimiento: row.fechaVencimiento,
              isCompra: Boolean(row.isCompra),
            });
          }

          if (currentProducto) {
            productos.push(currentProducto);
          }
          resolve(productos);
        },
        error => {
          console.error('Error fetching products with movimientos: ', error);
          reject(error);
        },
      );
    });
  });
};

export const addMovimientoProducto = async (movimiento: MovimientoProducto) => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO movimiento_producto (product_id, fechaCreacion, precio, cantidad, isUnitario, precioUnitario, isVence, fechaVencimiento, isCompra) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          movimiento.idProducto,
          movimiento.fechaCreacion,
          movimiento.precio,
          movimiento.cantidad,
          movimiento.isUnitario ? 1 : 0,
          movimiento.precioUnitario,
          movimiento.isVence ? 1 : 0,
          movimiento.fechaVencimiento,
          movimiento.isCompra ? 1 : 0,
        ],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
};

export const updateMovimientoProducto = async (
  movimiento: MovimientoProducto,
) => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE movimiento_producto SET product_id = ?, fechaCreacion = ?, precio = ?, cantidad = ?, isUnitario = ?, precioUnitario = ?, isVence = ?, fechaVencimiento = ?, isCompra = ? WHERE id = ?',
        [
          movimiento.idProducto,
          movimiento.fechaCreacion,
          movimiento.precio,
          movimiento.cantidad,
          movimiento.isUnitario ? 1 : 0,
          movimiento.precioUnitario,
          movimiento.isVence ? 1 : 0,
          movimiento.fechaVencimiento,
          movimiento.isCompra ? 1 : 0,
          movimiento.id,
        ],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
};

export const deleteMovimientoProducto = async (id: number) => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM movimiento_producto WHERE id = ?',
        [id],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
};

export const getMovimientoProductoById = async (
  id: number,
): Promise<MovimientoProducto | null> => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM movimiento_producto WHERE id = ?',
        [id],
        (_, result) => {
          if (result.rows.length > 0) {
            const row = result.rows.item(0);
            const movimientoProducto: MovimientoProducto = {
              id: row.id,
              idProducto: row.product_id,
              fechaCreacion: row.fechaCreacion,
              precio: row.precio,
              cantidad: row.cantidad,
              isUnitario: Boolean(row.isUnitario),
              precioUnitario: row.precioUnitario,
              isVence: Boolean(row.isVence),
              fechaVencimiento: row.fechaVencimiento,
              isCompra: Boolean(row.isCompra),
            };

            resolve(movimientoProducto);
          } else {
            resolve(null);
          }
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
};

// export const getMovimientoByProductId = async (productId: number) => {
//   const db = await getDBConnection();

//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'SELECT * FROM movimiento_producto WHERE product_id = ?',
//         [productId],
//         (_, result) => {
//           resolve(result.rows.raw());
//         },
//         (_, error) => {
//           reject(error);
//         },
//       );
//     });
//   });
// };
export const getMovimientoByProductId = async (productId: number) => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM movimiento_producto WHERE product_id = ?',
        [productId],
        (_, result) => {
          const rows = result.rows.raw();
          console.log(`Query successful, found ${rows.length} rows`);
          resolve(rows);
        },
        (_, error) => {
          console.error('Query failed', error);
          reject(error);
        },
      );
    });
  });
};

export const insertProduct = async (
  name: string,
  categoria: string,
  fechaCreacion: string,
) => {
  const db = await getDBConnection();

  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO productos (name, categoria, fechaCreacion) VALUES (?, ?, ?);',
        [name, categoria, fechaCreacion],
        (_, result) => {
          console.log('Product inserted successfully', result);
          resolve();
        },
        error => {
          console.error('Error inserting product: ', error);
          reject(error);
        },
      );
    });
  });
};

export const insertProductWithMovimiento = async (
  producto: Producto,
  movimiento: MovimientoProducto,
) => {
  const db = await getDBConnection();

  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO productos (nombre, categoria, fechaCreacion) VALUES (?, ?, ?);',
        [producto.nombre, producto.categoria, producto.fechaCreacion],
        (tx, result) => {
          const productId = result.insertId; // Get the ID of the newly inserted product

          tx.executeSql(
            `INSERT INTO movimiento_producto (product_id, fechaCreacion, precio, cantidad, isUnitario, precioUnitario, isVence, fechaVencimiento, isCompra) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              productId,
              movimiento.fechaCreacion,
              movimiento.precio,
              movimiento.cantidad,
              movimiento.isUnitario,
              movimiento.precioUnitario,
              movimiento.isVence,
              movimiento.fechaVencimiento,
              movimiento.isCompra,
            ],
            () => {
              console.log(
                'Product and movimiento_producto inserted successfully',
              );
              resolve();
            },
            error => {
              console.error('Error inserting movimiento_producto: ', error);
              reject(error);
            },
          );
        },
        error => {
          console.error('Error inserting product: ', error);
          reject(error);
        },
      );
    });
  });
};

export const deleteSpecifiedTables = async (): Promise<void> => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      const tablesToDelete = ['productos', 'movimiento_producto'];
      tablesToDelete.forEach(table => {
        tx.executeSql(
          `DROP TABLE IF EXISTS ${table};`,
          [],
          () => {
            console.log(`Table ${table} deleted successfully`);
          },
          error => {
            console.log(`Error deleting table ${table}: `, error);
            reject(error);
          },
        );
      });
      resolve();
    });
  });
};
