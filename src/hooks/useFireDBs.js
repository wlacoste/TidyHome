import {
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  db,
} from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';

import { nanoid } from 'nanoid';

import auth from '@react-native-firebase/auth';

const getRef = subColeccion => {
  // const dataRef = firestore();
  let dynamicRef = firestore();

  subColeccion.forEach(item => {
    dynamicRef = dynamicRef.collection(item.coleccion);
    if (item.id) {
      dynamicRef = dynamicRef.doc(item.id);
    }
  });

  return dynamicRef;
};

export const useFireDB = () => {
  const getData = async (coleccion, setLoading, setData, setError, filtro) => {
    if (!auth().currentUser) {
      return;
    }
    try {
      setLoading(prev => ({ ...prev, getData: true }));

      const dataRef = firestore().collection(coleccion);
      let query;
      if (filtro) {
        query = dataRef.where('uid', '==', auth().currentUser.uid);
      } else {
        query = dataRef;
      }
      const querySnapshot = await query.get();
      const dataDB = querySnapshot.docs.map(doc => doc.data());

      setData(dataDB);
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, getData: false }));
    }
  };

  const getColeccion = async (setLoading, setData, setError, subColeccion) => {
    if (!auth().currentUser) {
      return;
    }
    try {
      setLoading(prev => ({ ...prev, getData: true }));
      const dataRef = getRef(subColeccion);
      const querySnapshot = await dataRef.get();
      if (subColeccion[subColeccion.length - 1].id) {
        const data = querySnapshot.data();
        return setData([data]);
      }
      const dataDB = querySnapshot.docs.map(doc => doc.data());
      setData(dataDB);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, getData: false }));
    }
  };

  const addData = async (
    data,
    coleccion,
    setLoading,
    setData,
    setError,
    nanoId,
  ) => {
    try {
      setLoading(prev => ({ ...prev, addData: true }));
      const newDoc = {
        ...data,
        nanoid: nanoId,
        uid: auth.currentUser.uid,
      };
      const docRef = doc(db, coleccion, newDoc.nanoid);
      await setDoc(docRef, newDoc);
      setData(prev => {
        return [...prev, { ...newDoc }];
      });
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, addData: false }));
    }
  };

  const deleteData = async (
    nanoId,
    coleccion,
    setLoading,
    setData,
    setError,
  ) => {
    try {
      setLoading(prev => ({ ...prev, [nanoId]: true }));
      const docRef = doc(db, coleccion, nanoId);
      await deleteDoc(docRef);
      setData(prev => prev.filter(item => item.nanoid !== nanoId));
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, [nanoId]: false }));
    }
  };

  const updateData = async (
    newDato,
    coleccion,
    setLoading,
    setData,
    setError,
  ) => {
    try {
      setLoading(prev => ({ ...prev, [newDato.nanoid]: true }));
      const docRef = doc(db, coleccion, newDato.nanoid);
      await updateDoc(docRef, newDato);
      setData(prev =>
        prev.map(item => (item.nanoid === newDato.nanoid ? newDato : item)),
      );
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, [newDato.nanoid]: false }));
    }
  };

  return {
    getData,
    addData,
    deleteData,
    updateData,
    getColeccion,
  };
};
