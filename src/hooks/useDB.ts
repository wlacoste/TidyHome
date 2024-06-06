import { useEffect } from 'react';
import { createTables } from '../service/product-service';

const useDB = () => {
  useEffect(() => {
    createTables();
  }, []);
};

export default useDB;
