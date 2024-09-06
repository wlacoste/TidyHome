import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useProductContext } from '../context/productContext';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { IAddData, IGetColeccion, useFireDB } from '../hooks/useFireDB';
import { nanoid } from 'nanoid';
import { useCategories } from '../context/categoryContext';
import { getFechaGuardado } from '../service/product-service';
import useExportacion from '../hooks/useExportacion';

const Exportacion = () => {
  // const { productos, loading } = useProductContext();
  // const { addData, getColeccion, updateData, checkIfCollectionExists } =
  //   useFireDB();
  // const [error, setError] = useState();
  // const [isLoading, setLoading] = useState({ getData: false });
  // const [products, setProducts] = useState<any[]>([]);
  // const { categories: catContext } = useCategories();

  // const [savedDate, setSavedDate] = useState<Date | null>(null);
  // const [savedDateCloud, setSavedDateCloud] = useState<any>(null);

  // useEffect(() => {
  //   const fetchSavedDate = async () => {
  //     try {
  //       const date = await getFechaGuardado();
  //       setSavedDate(date);
  //     } catch (error) {
  //       console.error('Error fetching saved date:', error);
  //     }
  //   };

  //   fetchSavedDate();
  // }, []);
  // const handleSubmit = async () => {
  //   const id = nanoid(6);
  //   if (productos.length === 0) {
  //     return;
  //   }

  //   if (!auth().currentUser) {
  //     console.log('no hay usuario');
  //     return;
  //   }

  //   const requestCategories: IAddData = {
  //     setLoading: setLoading,
  //     setData: setProducts,
  //     setError: setError,
  //     subColeccion: [
  //       { coleccion: 'Users', id: auth().currentUser?.uid },
  //       { coleccion: 'categoria' },
  //     ],
  //     data: { valor: catContext, nanoId: id },
  //   };

  //   await addData(requestCategories);

  //   const request: IAddData = {
  //     setLoading: setLoading,
  //     setData: setProducts,
  //     setError: setError,
  //     subColeccion: [
  //       { coleccion: 'Users', id: auth().currentUser?.uid },
  //       { coleccion: 'producto' },
  //     ],
  //     data: { valor: productos, nanoId: id },
  //   };
  //   await addData(request);
  // };
  // const handleSubmitFecha = async () => {
  //   if (savedDate === null) {
  //     return;
  //   }

  //   if (!auth().currentUser) {
  //     console.log('no hay usuario');
  //     return;
  //   }

  //   const requestSaveFecha: IAddData = {
  //     setLoading: setLoading,
  //     setData: setProducts,
  //     setError: setError,
  //     subColeccion: [
  //       { coleccion: 'Users', id: auth().currentUser?.uid },
  //       { coleccion: 'Datos' },
  //     ],
  //     data: { valor: new Date(), nanoId: 'producto' },
  //   };

  //   await addData(requestSaveFecha);
  // };
  // const handleGetFecha = async () => {
  //   if (!auth().currentUser) {
  //     console.log('no hay usuario');
  //     return;
  //   }

  //   const request: IGetColeccion = {
  //     setLoading: setLoading,
  //     setData: setSavedDateCloud,
  //     setError: setError,
  //     subColeccion: [
  //       { coleccion: 'Users', id: auth().currentUser?.uid },
  //       { coleccion: 'ultimaCarga', id: 'ultimaCarga' },
  //     ],
  //   };
  //   await getColeccion(request);
  // };

  // useEffect(() => {
  //   console.log('fecha cloude', savedDateCloud?.[0]?.valor);
  // }, [savedDateCloud]);

  // const [collectionExists, setCollectionExists] = useState<boolean | null>(
  //   null,
  // );

  // useEffect(() => {
  //   const coleccion = [
  //     { coleccion: 'Users', id: auth().currentUser?.uid },
  //     { coleccion: 'ultimaCarga' },
  //   ];
  //   const checkCollection = async () => {
  //     const exists = await checkIfCollectionExists(coleccion);
  //     setCollectionExists(exists);
  //     console.log('existe', exists, coleccion);
  //   };

  //   checkCollection();
  // }, []);

  const { openAlert, setOpenAlert, comenzarCarga, cargarDatos } =
    useExportacion();
  return (
    <>
      <View style={{ gap: 10 }}>
        <Text>Exportacion</Text>
        {/* <Button onPress={() => handleSubmit()}>Exportar</Button>
        <Button onPress={() => handleSubmitFecha()} mode="contained">
          Exportar fecha
        </Button>
        <Button onPress={() => handleGetFecha()} mode="contained">
          Get fecha
        </Button> */}
        <Button onPress={() => setOpenAlert(true)} mode="contained">
          Open alert
        </Button>
        <Button onPress={() => cargarDatos()} mode="contained">
          Cargar datos
        </Button>
      </View>
      <Portal>
        <Dialog visible={openAlert} onDismiss={() => setOpenAlert(false)}>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Se encontraron datos en la nube mas recientes que los locales.
              Desea continuar y guardar los datos en la nube?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setOpenAlert(false)}>Cancelar</Button>
            <Button
              onPress={() => {
                comenzarCarga(false);
                setOpenAlert(false);
              }}>
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default Exportacion;

const styles = StyleSheet.create({});
