import SQLite, {
  enablePromise,
  openDatabase,
} from 'react-native-sqlite-storage';

export const getDBConnection = async () => {
  return openDatabase({ name: 'cleanApp.db', location: 'default' });
};

enablePromise(true);

export const initDatabase = async () => {
  const db = await getDBConnection();

  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Theme (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT)',
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
          return false;
        },
      );
    });
  });
};

export const saveTheme = async (themeType: 'light' | 'dark' | 'system') => {
  const db = await getDBConnection();

  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT OR REPLACE INTO Theme (id, type) VALUES (1, ?)',
        [themeType],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
          return false;
        },
      );
    });
  });
};

export const getTheme = async (): Promise<'light' | 'dark' | 'system'> => {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT type FROM Theme WHERE id = 1',
        [],
        (_, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0).type as 'light' | 'dark' | 'system');
          } else {
            resolve('system'); // Default theme if not set
          }
        },
        (_, error) => {
          console.log('error here');
          reject(error);
          return false;
        },
      );
    });
  });
};
