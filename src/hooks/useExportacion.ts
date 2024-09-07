import { useEffect, useState } from 'react';
import { IAddData, IGetColeccion, useFireDB } from './useFireDB';
import auth from '@react-native-firebase/auth';
import { getFechaGuardado, updateFechaGuardado } from '../service/product-service';
import { useCategories } from '../context/categoryContext';
import { useProductContext } from '../context/productContext';
import { Producto } from '../models/productos';
import {
  insertCategoriesInSequence,
  insertProductsAndMovements,
  resetTable,
  transferTableDataSaves,
} from '../service/sincronizacion-service';
import { Categoria } from '../models/categorias';
import Toast from 'react-native-toast-message';

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
  const { categories: catContext, refreshCategories } = useCategories();
  const { productos, loading, getProductos } = useProductContext();
  const [data, setData] = useState<any[]>([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [openAlertDescarga, setOpenAlertDescarga] = useState(false);
  const [cargarData, setCargarData] = useState(false);
  const [descargarData, setDescargarData] = useState(false);
  const [datosEnLaNube, setDatosEnLaNube] = useState(false);

  const [productosDescarga, setProductosDescarga] = useState<any>(undefined);
  const [error, setError] = useState();
  const [isLoading, setLoading] = useState({ getData: false });
  const { addData, getColeccion, updateData, checkIfCollectionExists } = useFireDB();
  const [procesoCarga, setProcesoCarga] = useState(false);

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

  useEffect(() => {
    if (!cargarData) {
      return;
    }
    if (!localDate) {
      return;
    }
    if (cloudDate) {
      const fechaCloud = convertFirebaseTimestampToDate(cloudDate[0].valor);
      if (fechaCloud > localDate) {
        setOpenAlert(true);
        return;
      } else {
        comenzarCarga(false);
      }
    }
  }, [cloudDate]);

  useEffect(() => {
    const fetchHayDatosNube = async () => {
      if (!auth().currentUser) {
        Toast.show({
          type: 'error',
          text1: 'Necesitas iniciar sesión',
        });
        return;
      }
      try {
        const date = await existenDatosEnLaNube();
        setDatosEnLaNube(date);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Ocurrio un error conectando con los servidores',
        });
        console.error('Error fetching saved date:', error);
      }
    };

    fetchHayDatosNube();
  }, [auth]);

  useEffect(() => {
    const descargaDatos = async () => {
      try {
        const categorias = productosDescarga.find(dato => dato.nanoId === 'categoria');
        const categoriaGuardar = categorias.valor as Categoria[];
        await insertCategoriesInSequence(categoriaGuardar);
        const producto = productosDescarga.find(dato => dato.nanoId === 'producto');
        const prod = producto.valor as Producto[];
        await insertProductsAndMovements(prod);

        const ultimaFechaDato = productosDescarga.find(dato => dato.nanoId === 'ultimaCarga');

        const ultFecha = convertFirebaseTimestampToDate(ultimaFechaDato.valor);
        await updateFechaGuardado(ultFecha);
        await transferTableDataSaves();
        await refreshCategories();
        await getProductos();
        Toast.show({
          type: 'success',
          text1: 'Se obtuvo la información con éxito',
        });
      } catch (e) {
        console.log(e);
        Toast.show({
          type: 'error',
          text1: 'Ocurrio un error guardando la información',
        });
      } finally {
        setDescargarData(false);
        setProcesoCarga(false);
      }
    };
    if (productosDescarga && descargarData) {
      descargaDatos();
    }
  }, [productosDescarga]);
  const existenDatosEnLaNube = async () => {
    const coleccion = [
      { coleccion: 'Users', id: auth().currentUser?.uid },
      { coleccion: 'Datos', id: 'ultimaCarga' },
    ];

    const existe = await checkIfCollectionExists(coleccion);
    return existe;
  };

  const descargarDatos = async () => {
    if (!auth().currentUser) {
      Toast.show({
        type: 'error',
        text1: 'Necesitas iniciar sesión',
      });
      return;
    }
    if (!datosEnLaNube) {
      Toast.show({
        type: 'error',
        text1: 'No se encontraron datos en la nube',
      });
      return;
    }
    setProcesoCarga(true);
    setDescargarData(true);
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
    if (cloudDate && localDate) {
      const fechaCloud = convertFirebaseTimestampToDate(cloudDate[0].valor);
      console.log('fechaCloud', fechaCloud);
      console.log('localDate', localDate);
      if (fechaCloud < localDate) {
        return setOpenAlertDescarga(true);
      }
    }
    descargarDatosNube();
  };
  const descargarDatosNube = async () => {
    const request: IGetColeccion = {
      setLoading: setLoading,
      setData: setProductosDescarga,
      setError: setError,
      subColeccion: [{ coleccion: 'Users', id: auth().currentUser?.uid }, { coleccion: 'Datos' }],
    };
    try {
      await getColeccion(request);
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Ocurrió un problema al obtener los datos',
      });
      setProcesoCarga(false);
    }
  };

  const cargarDatos = async () => {
    if (!auth().currentUser) {
      Toast.show({
        type: 'error',
        text1: 'Necesitas iniciar sesión',
      });
      return;
    }
    if (localDate === null) {
      return;
    }
    setProcesoCarga(true);
    setCargarData(true);
    if (datosEnLaNube) {
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

  const comenzarCarga = async (primeraCarga: boolean) => {
    if (catContext.length === 0 || productos.length === 0) {
      return;
    }
    try {
      const requestCategories: IAddData = {
        setLoading: setLoading,
        setData: setData,
        setError: setError,
        subColeccion: [{ coleccion: 'Users', id: auth().currentUser?.uid }, { coleccion: 'Datos' }],
        data: { valor: catContext, nanoId: 'categoria' },
      };
      const requestProductos: IAddData = {
        setLoading: setLoading,
        setData: setData,
        setError: setError,
        subColeccion: [{ coleccion: 'Users', id: auth().currentUser?.uid }, { coleccion: 'Datos' }],
        data: { valor: productos, nanoId: 'producto' },
      };
      const requestFechaCarga: IAddData = {
        setLoading: setLoading,
        setData: setData,
        setError: setError,
        subColeccion: [{ coleccion: 'Users', id: auth().currentUser?.uid }, { coleccion: 'Datos' }],
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
      Toast.show({
        type: 'success',
        text1: 'Datos cargados correctamente',
      });
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Ocurrío un error al cargar los datos',
      });
      console.log('error subiendo datos', e);
    } finally {
      setCargarData(false);
      setProcesoCarga(false);
    }
  };
  return {
    openAlert,
    cargarDatos,
    setOpenAlert,
    comenzarCarga,
    openAlertDescarga,
    setOpenAlertDescarga,
    descargarDatosNube,
    descargarDatos,
    setProcesoCarga,
    procesoCarga,
  };
};

export default useExportacion;
