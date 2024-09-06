import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useProductContext } from '../context/productContext';
import { Button } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { IAddData, useFireDB } from '../hooks/useFireDB';
import { nanoid } from 'nanoid';
import { useCategories } from '../context/categoryContext';

const Exportacion = () => {
  const { productos, loading } = useProductContext();
  const { addData, getColeccion } = useFireDB();
  const [error, setError] = useState();
  const [isLoading, setLoading] = useState({ getData: false });
  const [products, setProducts] = useState<any[]>([]);
  const { categories: catContext } = useCategories();

  const handleSubmit = async () => {
    const id = nanoid(6);
    if (productos.length === 0) {
      return;
    }

    if (!auth().currentUser) {
      console.log('no hay usuario');
      return;
    }

    const requestCategories: IAddData = {
      setLoading: setLoading,
      setData: setProducts,
      setError: setError,
      subColeccion: [
        { coleccion: 'Users', id: auth().currentUser?.uid },
        { coleccion: 'categoria' },
      ],
      data: { valor: catContext, nanoId: id },
    };

    await addData(requestCategories);

    const request: IAddData = {
      setLoading: setLoading,
      setData: setProducts,
      setError: setError,
      subColeccion: [
        { coleccion: 'Users', id: auth().currentUser?.uid },
        { coleccion: 'producto' },
      ],
      data: { valor: productos, nanoId: id },
    };
    await addData(request);
  };

  console.log(isLoading);
  return (
    <View>
      <Text>Exportacion</Text>
      <Button onPress={() => handleSubmit()}>Exportar</Button>
    </View>
  );
};

export default Exportacion;

const styles = StyleSheet.create({});
