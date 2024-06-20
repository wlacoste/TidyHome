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

export const createTables = async () => {
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

// export const getAllProductsWithMovements = async (): Promise<Producto[]> => {
//   const db = await getDBConnection();

//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'SELECT * FROM productos',
//         [],
//         (tx, results) => {
//           const products: Producto[] = [];
//           const rows = results.rows;

//           for (let i = 0; i < rows.length; i++) {
//             const product = rows.item(i);
//             products.push({
//               id: product.id,
//               nombre: product.nombre,
//               categoria: product.categoria,
//               fechaCreacion: product.fechaCreacion,
//               detalle: [],
//             });
//           }

//           const productIds = products.map(product => product.id).join(',');
//           console.log('prodcutos', productIds);

//           if (productIds.length === 0) {
//             resolve(products);
//           }

//           tx.executeSql(
//             `SELECT * FROM movimiento_producto WHERE product_id IN (${productIds})`,
//             [],
//             (tx, movementResults) => {
//               const movementRows = movementResults.rows;

//               console.log('rows', movementRows.item(1));

//               for (let i = 0; i < movementRows.length; i++) {
//                 const movement = movementRows.item(i);
//                 const productIndex = products.findIndex(
//                   product => product.id === movement.idProducto,
//                 );

//                 console.log('movement', movement);

//                 if (productIndex !== -1) {
//                   products[productIndex].detalle.push({
//                     id: movement.id,
//                     idProducto: movement.idProducto,
//                     fechaCreacion: movement.fechaCreacion,
//                     precio: movement.precio,
//                     cantidad: movement.cantidad,
//                     isUnitario: Boolean(movement.isUnitario),
//                     precioUnitario: movement.precioUnitario,
//                     isVence: Boolean(movement.isVence),
//                     fechaVencimiento: movement.fechaVencimiento,
//                     isCompra: Boolean(movement.isCompra),
//                   });
//                 }
//               }

//               resolve(products);
//             },
//             error => {
//               console.error(error);
//               reject(error);
//             },
//           );
//         },
//         error => {
//           console.error(error);
//           reject(error);
//         },
//       );
//     });
//   });
// };

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
         ORDER BY p.id, mp.fechaCreacion`,
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
        [{ ...movimiento }],
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

export const getMovimientoByProductId = async (productId: number) => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM movimiento_producto WHERE product_id = ?',
        [productId],
        (_, result) => {
          resolve(result.rows.raw());
        },
        (_, error) => {
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
