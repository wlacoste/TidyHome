import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import ProductoBar from '../ProductoBar';
import { useProductContext } from '../../context/productContext';

const VisorProducto = () => {
  const { productos } = useProductContext();

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
});
