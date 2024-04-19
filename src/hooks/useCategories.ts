import { useEffect, useState } from 'react';
import { useFireDB } from './useFireDB';
import { ICategoria } from '../components';

export const useCategories = () => {
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState({ getData: false });
  const { getData } = useFireDB();

  const getCategorias = async () => {
    getData('categoria', setLoading, setCategorias, setError, false);
  };

  // useEffect(() => {
  //   console.log('categorias', categorias);
  //   console.log('loading', loading);
  // }, [categorias, loading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        getCategorias();
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return {
    categorias,
    error,
    loading,
    getCategorias,
  };
};
