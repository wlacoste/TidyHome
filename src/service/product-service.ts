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
