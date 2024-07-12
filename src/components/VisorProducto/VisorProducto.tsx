import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import ProductoBar from '../ProductoBar';
import { useProductContext } from '../../context/productContext';
import { Text } from 'react-native-paper';

const VisorProducto = () => {
  const { productos } = useProductContext();
  console.log(productos);
  // console.log(productos[0].detalle);

  return (
    <>
      <ScrollView nestedScrollEnabled style={styles.contenedor}>
        {productos.map((producto, index) => (
          <ProductoBar
            key={`${index}-${producto.id}-${producto.nombre}`}
            producto={producto}
          />
        ))}
        {/* <Text>Hola</Text> */}
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
