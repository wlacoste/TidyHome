import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import ProductoBar from '../components/GestorProductos/ProductoBar';
import { useProductContext } from '../context/productContext';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useFab } from '../context/fabContext';

const VisorProducto = () => {
  const { productos, loading } = useProductContext();

  const { showFab, hideFab } = useFab();

  useEffect(() => {
    showFab();
    // return () => hideFab(); // Hide when unmounting
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        style={styles.loading}
        animating={true}
        size={'large'}
      />
    );
  }
  if (productos.length === 0) {
    return (
      <View style={styles.mensaje}>
        <Text variant="titleLarge" style={styles.textomensaje}>
          Aun no tenés productos.
        </Text>
        <Text variant="titleLarge" style={styles.textomensaje}>
          Podes añadirlos y empezar a trackearlos!
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView nestedScrollEnabled style={styles.contenedor}>
        {productos.map((producto, index) => (
          <ProductoBar
            key={`${index}-${producto.id}-${producto.nombre}`}
            producto={producto}
          />
        ))}
      </ScrollView>
    </>
  );
};

export default VisorProducto;

const styles = StyleSheet.create({
  contenedor: {
    paddingTop: 10,
  },
  loading: {
    flexGrow: 1,
  },
  mensaje: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: '10%',
    gap: 10,
    textAlign: 'left',
  },
  textomensaje: {
    textAlign: 'center',
    fontWeight: '800',
  },
});
