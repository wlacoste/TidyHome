// import {
//   deleteDoc,
//   doc,
//   setDoc,
//   updateDoc,
//   db,
// } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';

import { nanoid } from 'nanoid';

import auth from '@react-native-firebase/auth';

export interface IGetColeccion {
  setLoading: React.Dispatch<React.SetStateAction<any>>;
  setData: React.Dispatch<React.SetStateAction<any>>;
  setError: React.Dispatch<React.SetStateAction<any>>;
  subColeccion: { coleccion: string; id?: string }[];
}
export interface IAddData {
  data: { nanoId: string; [key: string]: any };
  setLoading: React.Dispatch<React.SetStateAction<any>>;
  setData: React.Dispatch<React.SetStateAction<any>>;
  setError: React.Dispatch<React.SetStateAction<any>>;
  subColeccion: { coleccion: string; id?: string }[];
}
export interface IDeleteData {
  nanoId: string;
  subColeccion: { coleccion: string; id?: string }[];
  setLoading: React.Dispatch<React.SetStateAction<any>>;
  setData: React.Dispatch<React.SetStateAction<any>>;
  setError: React.Dispatch<React.SetStateAction<any>>;
}

const getRef = (subColeccion: { coleccion: string; id?: string }[]) => {
  // const dataRef = firestore();
  let dynamicRef: any = firestore();

  subColeccion.forEach(item => {
    dynamicRef = dynamicRef.collection(item.coleccion);
    if (item.id) {
      dynamicRef = dynamicRef.doc(item.id);
    }
  });
  return dynamicRef;
};
export const useFireDB = () => {
  const getColeccion = async ({
    setLoading,
    setData,
    setError,
    subColeccion,
  }: IGetColeccion) => {
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
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, getData: false }));
    }
  };

  const addData = async ({
    data,
    setLoading,
    setError,
    subColeccion,
  }: IAddData) => {
    if (!auth().currentUser) {
      return;
    }
    try {
      setLoading(prev => ({ ...prev, addData: true }));
      const dataRef = getRef(subColeccion);

      dataRef
        .doc(data.nanoId)
        .set(data)
        .then(() => {
          console.log('data added');
        });
      // setData(prev => {
      //   return [...prev, { ...data }];
      // });
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, addData: false }));
    }
  };
  const updateData = async ({
    data,
    setLoading,
    setError,
    subColeccion,
  }: IAddData) => {
    if (!auth().currentUser) {
      return;
    }
    try {
      setLoading(prev => ({ ...prev, [data.nanoid]: true }));
      const dataRef = getRef(subColeccion);

      dataRef
        .doc(data.nanoId)
        .update(data)
        .then(() => {
          console.log('data updated');
        });
      // setData(prev => {
      //   return [...prev, { ...data }];
      // });
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, [data.nanoid]: false }));
    }
  };

  const deleteData = async ({
    nanoId,
    setLoading,
    setError,
    subColeccion,
  }: IDeleteData) => {
    if (!auth().currentUser) {
      return;
    }
    try {
      setLoading(prev => ({ ...prev, [nanoId]: true }));
      const dataRef = getRef(subColeccion);

      dataRef
        .doc(nanoId)
        .delete()
        .then(() => {
          console.log('data deleted');
        });
      // setData(prev => {
      //   return [...prev, { ...data }];
      // });
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, [nanoId]: false }));
    }
  };

  // const addData = async (
  //   data,
  //   coleccion,
  //   setLoading,
  //   setData,
  //   setError,
  //   nanoId,
  // ) => {
  //   if (!auth().currentUser) {
  //     return;
  //   }
  //   try {
  //     setLoading(prev => ({ ...prev, addData: true }));
  //     const newDoc = {
  //       ...data,
  //       nanoid: nanoId,
  //       uid: auth().currentUser!.uid,
  //     };
  //     const docRef = doc(db, coleccion, newDoc.nanoid);
  //     await setDoc(docRef, newDoc);
  //     setData(prev => {
  //       return [...prev, { ...newDoc }];
  //     });
  //   } catch (error: any) {
  //     console.log(error);
  //     setError(error.message);
  //   } finally {
  //     setLoading(prev => ({ ...prev, addData: false }));
  //   }
  // };

  // const deleteData = async (
  //   nanoId,
  //   coleccion,
  //   setLoading,
  //   setData,
  //   setError,
  // ) => {
  //   try {
  //     setLoading(prev => ({ ...prev, [nanoId]: true }));
  //     const docRef = doc(db, coleccion, nanoId);
  //     await deleteDoc(docRef);
  //     setData(prev => prev.filter(item => item.nanoid !== nanoId));
  //   } catch (error: any) {
  //     console.log(error);
  //     setError(error.message);
  //   } finally {
  //     setLoading(prev => ({ ...prev, [nanoId]: false }));
  //   }
  // };

  // const updateData = async (
  //   newDato,
  //   coleccion,
  //   setLoading,
  //   setData,
  //   setError,
  // ) => {
  //   try {
  //     setLoading(prev => ({ ...prev, [newDato.nanoid]: true }));
  //     const docRef = doc(db, coleccion, newDato.nanoid);
  //     await updateDoc(docRef, newDato);
  //     setData(prev =>
  //       prev.map(item => (item.nanoid === newDato.nanoid ? newDato : item)),
  //     );
  //   } catch (error: any) {
  //     console.log(error);
  //     setError(error.message);
  //   } finally {
  //     setLoading(prev => ({ ...prev, [newDato.nanoid]: false }));
  //   }
  // };

  return {
    addData,
    // deleteData,
    updateData,
    getColeccion,
  };
};
