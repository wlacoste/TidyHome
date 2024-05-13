import { useEffect, useState } from 'react';
import { useFireDB } from './useFireDB';
import { ICategoria } from '../components/Categorias/Categorias';

export const useCategories = () => {
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState({ getData: false });
  const { getData } = useFireDB();

  const getCategorias = async () => {
    getData('categoria', setLoading, setCategorias, setError, false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        getCategorias();
      } catch (err) {
        console.log(err);
      }
    };
    if (categorias.length === 0) {
      fetchData();
    }
  }, []);

  return {
    categorias,
    error,
    loading,
    getCategorias,
  };
};
