import { useEffect, useState } from 'react';
import { IAddData, IGetColeccion, useFireDB } from './useFireDB';
import auth from '@react-native-firebase/auth';
import { getFechaGuardado } from '../service/product-service';
import { useCategories } from '../context/categoryContext';
import { useProductContext } from '../context/productContext';

interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
}

const convertFirebaseTimestampToDate = (timestamp: FirebaseTimestamp): Date => {
  return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
};

const useExportacion = () => {
  const [localDate, setLocalDate] = useState<Date | null>(null);
  const [cloudDate, setCloudDate] = useState<any>(null);
  const { categories: catContext } = useCategories();
  const { productos, loading } = useProductContext();
  const [data, setData] = useState<any[]>([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [cargarData, setCargarData] = useState(false);

  const [error, setError] = useState();
  const [isLoading, setLoading] = useState({ getData: false });
  const { addData, getColeccion, updateData, checkIfCollectionExists } =
    useFireDB();

  useEffect(() => {
    const fetchSavedDate = async () => {
      try {
        const date = await getFechaGuardado();
        setLocalDate(date);
      } catch (error) {
        console.error('Error fetching saved date:', error);
      }
    };

    fetchSavedDate();
  }, [catContext, productos]);

  const existenDatosEnLaNube = async () => {
    const coleccion = [
      { coleccion: 'Users', id: auth().currentUser?.uid },
      { coleccion: 'Datos', id: 'ultimaCarga' },
    ];

    const existe = await checkIfCollectionExists(coleccion);
    console.log('existe', existe);
    return existe;
  };

  const cargarDatos = async () => {
    if (!auth().currentUser) {
      console.log('no hay usuario');
      return;
    }
    if (localDate === null) {
      return;
    }
    setCargarData(true);
    const existeFecha = await existenDatosEnLaNube();
    if (existeFecha) {
      const request: IGetColeccion = {
        setLoading: setLoading,
        setData: setCloudDate,
        setError: setError,
        subColeccion: [
          { coleccion: 'Users', id: auth().currentUser?.uid },
          { coleccion: 'Datos', id: 'ultimaCarga' },
        ],
      };
      await getColeccion(request);
    } else {
      comenzarCarga(true);
    }
  };

  useEffect(() => {
    if (!cargarData) {
      return;
    }
    if (!localDate) {
      return;
    }
    if (cloudDate) {
      const fechaCloud = convertFirebaseTimestampToDate(cloudDate[0].valor);
      console.log('fecha', fechaCloud);
      console.log('localDate', localDate);
      console.log('es mayor fecha a localDate', fechaCloud > localDate);
      if (fechaCloud > localDate) {
        setOpenAlert(true);
        return;
      } else {
        comenzarCarga(false);
      }
    }
  }, [cloudDate]);

  const comenzarCarga = async (primeraCarga: boolean) => {
    // console.log('carga comenzada');
    // return;
    if (catContext.length === 0 || productos.length === 0) {
      return;
    }
    const requestCategories: IAddData = {
      setLoading: setLoading,
      setData: setData,
      setError: setError,
      subColeccion: [
        { coleccion: 'Users', id: auth().currentUser?.uid },
        { coleccion: 'Datos' },
      ],
      data: { valor: catContext, nanoId: 'categoria' },
    };
    const requestProductos: IAddData = {
      setLoading: setLoading,
      setData: setData,
      setError: setError,
      subColeccion: [
        { coleccion: 'Users', id: auth().currentUser?.uid },
        { coleccion: 'Datos' },
      ],
      data: { valor: productos, nanoId: 'producto' },
    };
    const requestFechaCarga: IAddData = {
      setLoading: setLoading,
      setData: setData,
      setError: setError,
      subColeccion: [
        { coleccion: 'Users', id: auth().currentUser?.uid },
        { coleccion: 'Datos' },
      ],
      data: { valor: localDate, nanoId: 'ultimaCarga' },
    };
    if (primeraCarga) {
      console.log('primera carga');
      await addData(requestCategories);
      await addData(requestProductos);
      await addData(requestFechaCarga);
    } else {
      console.log('actualizacion de datos en nube');
      await updateData(requestCategories);
      await updateData(requestProductos);
      await updateData(requestFechaCarga);
    }
  };
  return {
    openAlert,
    cargarDatos,
    setOpenAlert,
    comenzarCarga,
  };
};

export default useExportacion;
