import { doc, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { auth, db } from '../firebase-config';
import { useFireDB } from './useFireDB';

export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState({});
  const { getData, addData, deleteData, updateData } = useFireDB();

  const getProductos = async () => {
    console.log('obteninendo productos');
    getData('productos', setLoading, setProductos, setError, true);
  };
  // const addProducto = async (data) => {
  //     await addData(data, "productos", setLoading, setProductos, setError);
  // }

  const addProducto = async data => {
    console.log('aniadiendo producto');
    try {
      setLoading(prev => ({ ...prev, addData: true }));
      const newDoc = {
        ...data,
        nanoid: nanoid(6),
        uid: auth.currentUser.uid,
      };
      const docRef = doc(db, 'productos', newDoc.nanoid);
      await setDoc(docRef, newDoc);
      setProductos([...productos, newDoc]);
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, addData: false }));
    }
  };

  const deleteProducto = async id => {
    console.log('deleteProducto producto');
    deleteData(id, 'productos', setLoading, setProductos, setError);
  };

  const updateProducto = async data => {
    console.log('updateProducto producto');
    updateData(data, 'productos', setLoading, setProductos, setError);
  };

  return {
    productos,
    error,
    loading,
    getProductos,
    addProducto,
    deleteProducto,
    updateProducto,
  };
};
