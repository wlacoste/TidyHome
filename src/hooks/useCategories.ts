import { useEffect, useState } from 'react';
import { IGetColeccion, useFireDB } from './useFireDB';
import { ICategoria } from '../components/Categorias/Categorias';

export const useCategories = () => {
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState({ getData: false });
  const { getColeccion } = useFireDB();

  const getCategorias = async () => {
    // getData('categoria', setLoading, setCategorias, setError, false);

    const request: IGetColeccion = {
      setLoading: setLoading,
      setData: setCategorias,
      setError: setError,
      subColeccion: [{ coleccion: 'categoria' }],
    };
    getColeccion(request);
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
