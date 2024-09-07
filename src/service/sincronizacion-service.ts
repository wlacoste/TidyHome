import { ResultSet, Transaction } from 'react-native-sqlite-storage';
import { Categoria } from '../models/categorias';
import { Producto } from '../models/productos';
import { getDBConnection } from './product-service';

export const resetTable = async (tableName: string): Promise<void> => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM ${tableName}`,
        [],
        (_, result) => {
          console.log(`Deleted ${result.rowsAffected} rows from ${tableName} table`);
          tx.executeSql(
            'DELETE FROM sqlite_sequence WHERE name = ?',
            [tableName],
            (_, result) => {
              console.log(`Reset autoincrement counter for ${tableName} table`);
              resolve();
            },
            (_, error) => {
              console.error('Error resetting autoincrement:', error);
              reject(error);
            },
          );
        },
        (_, error) => {
          console.error('Error deleting rows:', error);
          reject(error);
        },
      );
    });
  });
};

export const insertCategoriesInSequence = async (categories: Categoria[]): Promise<void> => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // First, reset the table
        tx.executeSql(
          'DELETE FROM categoriesSave',
          [],
          (_, result) => {
            console.log(`Deleted ${result.rowsAffected} categoriesSave`);
            // Reset autoincrement counter
            tx.executeSql(
              'DELETE FROM sqlite_sequence WHERE name = "categoriesSave"',
              [],
              (_, result) => {
                console.log('Reset autoincrement counter for categoriesSave table');

                // Now proceed with inserting new categories
                const insertPromises = categories.map(
                  category =>
                    new Promise<void>((resolveInsert, rejectInsert) => {
                      tx.executeSql(
                        `INSERT OR REPLACE INTO categoriesSave (id, name, icon, isEnabled, color, ordenCategoria) 
                         VALUES (?, ?, ?, ?, ?, ?)`,
                        [
                          category.id,
                          category.name,
                          category.icon,
                          category.isEnabled ? 1 : 0,
                          category.color || '',
                          category.ordenCategoria,
                        ],
                        (_, result) => {
                          resolveInsert();
                        },
                        (_, error) => {
                          console.error(`Error inserting category ${category.name}:`, error);
                          rejectInsert(error);
                        },
                      );
                    }),
                );

                Promise.all(insertPromises)
                  .then(() => {
                    console.log('All categories inserted successfully');
                    resolve();
                  })
                  .catch(error => {
                    console.error('Error during category insertion:', error);
                    reject(error);
                  });
              },
              (_, error) => {
                console.error('Error resetting autoincrement:', error);
                reject(error);
              },
            );
          },
          (_, error) => {
            console.error('Error deleting rows:', error);
            reject(error);
          },
        );
      },
      error => {
        console.error('Transaction error:', error);
        reject(error);
      },
    );
  });
};

export const insertProductsAndMovements = async (products: Producto[]): Promise<void> => {
  const db = await getDBConnection();

  return new Promise<void>((resolve, reject) => {
    db.transaction(
      (tx: Transaction) => {
        ['productosSave', 'movimiento_productoSave'].forEach(table => {
          tx.executeSql(`DELETE FROM ${table}`);
          tx.executeSql('DELETE FROM sqlite_sequence WHERE name = ?', [table]);
        });

        const insertProduct = (product: Producto): Promise<void> =>
          new Promise<void>((resolveProduct, rejectProduct) => {
            tx.executeSql(
              `INSERT INTO productosSave(id, nombre, categoria_id, fechaCreacion, 
                  agregarListaCompra, cantidadDeAdvertencia, seguirEstadistica)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                product.id,
                product.nombre,
                product.categoria.id,
                product.fechaCreacion,
                product.agregarListaCompra ? 1 : 0,
                product.cantidadAdvertencia,
                product.seguirEstadistica ? 1 : 0,
              ],
              () => {
                const insertMovements = product.detalle.map(
                  movement =>
                    new Promise<[Transaction, ResultSet]>(resolveMovement => {
                      tx.executeSql(
                        `INSERT INTO movimiento_productoSave (id, product_id, fechaCreacion, precio, 
                          cantidad, isUnitario, precioUnitario, isVence, fechaVencimiento, 
                          isCompra, recordatorio)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                          movement.id,
                          product.id,
                          movement.fechaCreacion,
                          movement.precio,
                          movement.cantidad,
                          movement.isUnitario ? 1 : 0,
                          movement.precioUnitario,
                          movement.isVence ? 1 : 0,
                          movement.fechaVencimiento,
                          movement.isCompra ? 1 : 0,
                          movement.recordatorio,
                        ],
                        (_, resultSet) => resolveMovement([_, resultSet]),
                      );
                    }),
                );
                Promise.all(insertMovements)
                  .then(() => {
                    console.log('all productos inserted succesfully');
                    resolveProduct();
                  })
                  .catch(rejectProduct);
              },
              (_, error) => rejectProduct(error),
            );
          });

        Promise.all(products.map(insertProduct))
          .then(() => resolve())
          .catch(reject);
      },
      error => {
        console.error('Transaction error:', error);
        reject(error);
      },
    );
  });
};
export const resetAndInsertProductsAndMovements = async (products: Producto[]): Promise<void> => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // First, clear the productos and movimiento_producto tables
        tx.executeSql(
          'DELETE FROM productos',
          [],
          (_, result) => {
            console.log(`Deleted ${result.rowsAffected} rows from productos `);

            tx.executeSql(
              'DELETE FROM movimiento_producto',
              [],
              (_, result) => {
                console.log(`Deleted ${result.rowsAffected} rows from movimiento_producto table`);

                // Reset autoincrement counters
                tx.executeSql(
                  'DELETE FROM sqlite_sequence WHERE name IN ("productos", "movimiento_producto")',
                  [],
                  (_, result) => {
                    console.log('Reset autoinc counters for productos and movimiento tables');

                    // Now proceed with inserting new products and movements
                    const insertPromises = products.map(
                      product =>
                        new Promise<void>((resolveProduct, rejectProduct) => {
                          // Insert or update the product
                          tx.executeSql(
                            `INSERT OR REPLACE INTO productos (
                id, nombre, categoria_id, fechaCreacion, 
                agregarListaCompra, cantidadDeAdvertencia, seguirEstadistica
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                            [
                              product.id,
                              product.nombre,
                              product.categoria.id,
                              product.fechaCreacion,
                              product.agregarListaCompra ? 1 : 0,
                              product.cantidadAdvertencia,
                              product.seguirEstadistica ? 1 : 0,
                            ],
                            (_, result) => {
                              console.log(`Inserted/Updated product: ${product.nombre}`);

                              // Insert movements for this product
                              const movementPromises = product.detalle.map(
                                movement =>
                                  new Promise<void>((resolveMovement, rejectMovement) => {
                                    tx.executeSql(
                                      `INSERT OR REPLACE INTO movimiento_productoSave (
                        id, product_id, fechaCreacion, precio, cantidad, 
                        isUnitario, precioUnitario, isVence, fechaVencimiento, 
                        isCompra, recordatorio
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                      [
                                        movement.id,
                                        product.id,
                                        movement.fechaCreacion,
                                        movement.precio,
                                        movement.cantidad,
                                        movement.isUnitario ? 1 : 0,
                                        movement.precioUnitario,
                                        movement.isVence ? 1 : 0,
                                        movement.fechaVencimiento,
                                        movement.isCompra ? 1 : 0,
                                        movement.recordatorio,
                                      ],
                                      (_, result) => {
                                        console.log(
                                          `Inserted/Updated movement for product: ${product.nombre}`,
                                        );
                                        resolveMovement();
                                      },
                                      (_, error) => {
                                        console.error(
                                          `Error inserting/updating movement for product ${product.nombre}:`,
                                          error,
                                        );
                                        rejectMovement(error);
                                      },
                                    );
                                  }),
                              );

                              Promise.all(movementPromises)
                                .then(() => resolveProduct())
                                .catch(error => rejectProduct(error));
                            },
                            (_, error) => {
                              console.error(
                                `Error inserting/updating product ${product.nombre}:`,
                                error,
                              );
                              rejectProduct(error);
                            },
                          );
                        }),
                    );

                    Promise.all(insertPromises)
                      .then(() => {
                        console.log('All products and movements inserted/updated successfully');
                        resolve();
                      })
                      .catch(error => {
                        console.error('Error during product and movement insertion/update:', error);
                        reject(error);
                      });
                  },
                  (_, error) => {
                    console.error('Error resetting autoincrement counters:', error);
                    reject(error);
                  },
                );
              },
              (_, error) => {
                console.error('Error clearing movimiento_productoSave table:', error);
                reject(error);
              },
            );
          },
          (_, error) => {
            console.error('Error clearing productos table:', error);
            reject(error);
          },
        );
      },
      error => {
        console.error('Transaction error:', error);
        reject(error);
      },
    );
  });
};

const transferTableData = async (sourceTable, targetTable) => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Clear target table and reset its counter
        tx.executeSql(`DELETE FROM ${targetTable}`);
        tx.executeSql('DELETE FROM sqlite_sequence WHERE name = ?', [targetTable]);

        // Copy data from source to target
        tx.executeSql(`INSERT INTO ${targetTable} SELECT * FROM ${sourceTable}`);

        // Clear source table and reset its counter
        tx.executeSql(`DELETE FROM ${sourceTable}`);
        tx.executeSql('DELETE FROM sqlite_sequence WHERE name = ?', [sourceTable]);
      },
      error => {
        console.error('Transfer failed:', error);
        reject(error);
      },
      () => {
        resolve('Transfer completed successfully');
      },
    );
  });
};
export const transferTableDataSaves = async () => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Clear target table and reset its counter
        tx.executeSql('DELETE FROM movimiento_producto');
        tx.executeSql('DELETE FROM sqlite_sequence WHERE name = ?', ['movimiento_producto']);
        tx.executeSql('DELETE FROM productos');
        tx.executeSql('DELETE FROM sqlite_sequence WHERE name = ?', ['productos']);
        tx.executeSql('DELETE FROM categories');
        tx.executeSql('DELETE FROM sqlite_sequence WHERE name = ?', ['categories']);

        // Copy data from source to target
        tx.executeSql('INSERT INTO categories SELECT * FROM categoriesSave');
        tx.executeSql('INSERT INTO productos SELECT * FROM productosSave');
        tx.executeSql('INSERT INTO movimiento_producto SELECT * FROM movimiento_productoSave');

        // Clear source table and reset its counter
        tx.executeSql('DELETE FROM movimiento_productoSave');
        tx.executeSql('DELETE FROM sqlite_sequence WHERE name = ?', ['movimiento_productoSave']);
        tx.executeSql('DELETE FROM productosSave');
        tx.executeSql('DELETE FROM sqlite_sequence WHERE name = ?', ['productosSave']);
        tx.executeSql('DELETE FROM categoriesSave');
        tx.executeSql('DELETE FROM sqlite_sequence WHERE name = ?', ['categoriesSave']);
      },
      error => {
        console.error('Transfer failed:', error);
        reject(error);
      },
      () => {
        resolve('Transfer completed successfully');
      },
    );
  });
};
