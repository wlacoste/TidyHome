import { enablePromise, openDatabase } from 'react-native-sqlite-storage';
import { MovimientoProducto, Producto } from '../models/productos';
import { DefaultCategories, DefaultProductos } from '../models/categorias';

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
      `CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT,
        isEnabled INTEGER DEFAULT 1,
        color TEXT DEFAULT '',
        ordenCategoria INTEGER DEFAULT 0
      );`,
      [],
      () => {
        console.log('Categories table created successfully');
      },
      error => {
        console.error('Error creating categories table: ', error);
      },
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS categoriesSave (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT,
        isEnabled INTEGER DEFAULT 1,
        color TEXT DEFAULT '',
        ordenCategoria INTEGER DEFAULT 0
      );`,
      [],
      () => {
        console.log('Categories table created successfully');
      },
      error => {
        console.error('Error creating categories table: ', error);
      },
    );
    DefaultCategories.forEach(category => {
      tx.executeSql(
        'INSERT OR IGNORE INTO categories (id, name, icon, isEnabled) VALUES (?, ?, ?, ?);',
        [category.id, category.name, category.icon, category.isEnabled ? 1 : 0],
        () => console.log(`Default category "${category.name}" inserted`),
        (_, error) => {
          console.error(`Error inserting default category "${category.name}":`, error);
          return false;
        },
      );
    });

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        categoria_id INTEGER,
        fechaCreacion TEXT,
        agregarListaCompra INTEGER DEFAULT 0,
        cantidadDeAdvertencia INTEGER DEFAULT 0,
        seguirEstadistica INTEGER DEFAULT 1,
        FOREIGN KEY (categoria_id) REFERENCES categories (id) ON DELETE SET NULL
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
      `CREATE TABLE IF NOT EXISTS productosSave (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        categoria_id INTEGER,
        fechaCreacion TEXT,
        agregarListaCompra INTEGER DEFAULT 0,
        cantidadDeAdvertencia INTEGER DEFAULT 0,
        seguirEstadistica INTEGER DEFAULT 1,
        FOREIGN KEY (categoria_id) REFERENCES categoriesSave (id) ON DELETE SET NULL
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
          recordatorio string DEFAULT '',
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
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS movimiento_productoSave (
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
          recordatorio string DEFAULT '',
          FOREIGN KEY (product_id) REFERENCES productsSave (id) ON DELETE CASCADE
        );`,
      [],
      () => {
        console.log('Bought dates table created successfully');
      },
      error => {
        console.error('Error creating bought dates table: ', error);
      },
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS ListaCompras (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fechaCreacion TEXT,
        titulo TEXT,
        comentario TEXT
      );`,
      [],
      () => {
        console.log('ListaCompras table created successfully');
      },
      error => {
        console.error('Error creating table: ListaCompras', error);
      },
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS ProductosPorLista (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        idListaCompra INTEGER,
        idProducto INTEGER,
        nombre TEXT,
        cantidad INTEGER,
        FOREIGN KEY (idListaCompra) REFERENCES ListaCompras (id) ON DELETE CASCADE,
        FOREIGN KEY (idProducto) REFERENCES Producto (id) ON DELETE CASCADE
    );`,
      [],
      () => {
        console.log('ProductosPorLista table created successfully');
      },
      error => {
        console.error('Error creating table: ProductosPorLista', error);
      },
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS TodoItem (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tituloNota TEXT,
      fechaNota TEXT,
      nota TEXT
      );`,
      [],
      () => {
        console.log('TodoItem table created successfully');
      },
      error => {
        console.error('Error creating table: TodoItem', error);
      },
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS FechaGuardado (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha TEXT
      );`,
      [],
      () => {
        console.log('FechaGuardado table created successfully');
      },
      error => {
        console.error('Error creating table: FechaGuardado', error);
      },
    );
  });
};

export const updateFechaGuardado = async (fecha?: Date) => {
  const db = await getDBConnection();

  db.transaction(tx => {
    const now = fecha ? fecha.toISOString() : new Date().toISOString();

    tx.executeSql(
      'INSERT OR REPLACE INTO FechaGuardado (id, fecha) VALUES (1, ?)',
      [now],
      (_, result) => {
        console.log('FechaGuardado updated successfully');
      },
      (_, error) => {
        console.error('Error updating FechaGuardado:', error);
      },
    );
  });
};

export const getFechaGuardado = (): Promise<Date | null> => {
  return new Promise(async (resolve, reject) => {
    const db = await getDBConnection();

    db.transaction(tx => {
      tx.executeSql(
        'SELECT fecha FROM FechaGuardado ORDER BY id DESC LIMIT 1',
        [],
        (_, result) => {
          if (result.rows.length > 0) {
            const fecha = result.rows.item(0).fecha;
            resolve(new Date(fecha));
          } else {
            resolve(null);
          }
        },
        (_, error) => {
          console.error('Error fetching FechaGuardado:', error);
          reject(error);
        },
      );
    });
  });
};
export const getAllProductsWithMovements = async (): Promise<Producto[]> => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT p.*, mp.id as mp_id, mp.fechaCreacion as mp_fechaCreacion, 
                mp.precio, mp.cantidad, mp.isUnitario, mp.precioUnitario, 
                mp.isVence, mp.fechaVencimiento, mp.isCompra,mp.recordatorio, ct.name, ct.icon, ct.isEnabled, ct.color
         FROM productos p
         INNER JOIN movimiento_producto mp ON p.id = mp.product_id
         INNER JOIN categories ct ON p.categoria_id = ct.id
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
                categoria: {
                  id: row.categoria_id,
                  icon: row.icon,
                  name: row.name,
                  isEnabled: Boolean(row.isEnabled),
                  color: row.color,
                  ordenCategoria: row.ordenCategoria,
                },
                agregarListaCompra: Boolean(row.agregarListaCompra),
                cantidadAdvertencia: row.cantidadDeAdvertencia,
                seguirEstadistica: Boolean(row.seguirEstadistica),
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
              recordatorio: row.recordatorio,
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
        'INSERT INTO movimiento_producto (product_id, fechaCreacion, precio, cantidad, isUnitario, precioUnitario, isVence, fechaVencimiento, isCompra, recordatorio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
          movimiento.recordatorio,
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

export const updateMovimientoProducto = async (movimiento: MovimientoProducto) => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE movimiento_producto SET product_id = ?, fechaCreacion = ?, precio = ?, cantidad = ?, isUnitario = ?, precioUnitario = ?, isVence = ?, fechaVencimiento = ?, isCompra = ? , recordatorio = ? WHERE id = ?',
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
          movimiento.recordatorio,
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

export const updateProduct = async (product: Producto) => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE productos SET 
          nombre = ?, 
          categoria_id = ?, 
          agregarListaCompra = ?, 
          cantidadDeAdvertencia = ?, 
          seguirEstadistica = ? 
        WHERE id = ?`,
        [
          product.nombre,
          product.categoria.id,
          product.agregarListaCompra ? 1 : 0,
          product.cantidadAdvertencia,
          product.seguirEstadistica ? 1 : 0,
          product.id,
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

export const deleteProducto = async (id: number) => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM productos WHERE id = ?',
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

export const getMovimientoById = async (id: number): Promise<MovimientoProducto | null> => {
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
              recordatorio: row.recordatorio,
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
export const getMovimientosByProduct = async (productId: number) => {
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

// export const insertProduct = async (
//   name: string,
//   categoria: string,
//   fechaCreacion: string,
// ) => {
//   const db = await getDBConnection();

//   return new Promise<void>((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'INSERT INTO productos (name, categoria, fechaCreacion) VALUES (?, ?, ?);',
//         [name, categoria, fechaCreacion],
//         (_, result) => {
//           console.log('Product inserted successfully', result);
//           resolve();
//         },
//         error => {
//           console.error('Error inserting product: ', error);
//           reject(error);
//         },
//       );
//     });
//   });
// };
export const insertProduct = async (
  name: string,
  categoryId: number,
  fechaCreacion: string,
): Promise<number> => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO productos (nombre, categoria_id, fechaCreacion) VALUES (?, ?, ?);',
        [name, categoryId, fechaCreacion],
        (_, result) => {
          console.log('Product inserted successfully', result);
          resolve(result.insertId);
        },
        (_, error) => {
          console.error('Error inserting product: ', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

export const insertProductWithMovimiento = async (
  producto: Omit<Producto, 'id' | 'detalle'>,
  movimiento: Omit<MovimientoProducto, 'id' | 'idProducto'>,
): Promise<Producto> => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO productos (nombre, categoria_id, fechaCreacion) VALUES (?, ?, ?);',
        [producto.nombre, producto.categoria.id, producto.fechaCreacion],
        (tx, result) => {
          const productId = result.insertId;

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
            (tx, movResult) => {
              // Create the inserted MovimientoProducto object
              const insertedMovimiento: MovimientoProducto = {
                ...movimiento,
                id: movResult.insertId,
                idProducto: productId,
              };

              // Create the inserted Producto object
              const insertedProduct: Producto = {
                ...producto,
                id: productId,
                detalle: [insertedMovimiento],
              };

              resolve(insertedProduct);
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
      const tablesToDelete = [
        'productos',
        'movimiento_producto',
        'categories',
        'ProductosPorLista',
        'ListaCompras',
        'FechaGuardado',
      ];
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

export const insertDefaultProducts = async (): Promise<void> => {
  const productos = DefaultProductos;

  productos.forEach(async producto => {
    await insertProductWithMovimiento(producto.producto, producto.movimiento);
  });
};
