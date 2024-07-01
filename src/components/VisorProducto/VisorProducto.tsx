import React, { useContext, useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { getAllProductsWithMovements } from '../../service/product-service';
import { Producto } from '../../models';
import ProductoBar from '../ProductoBar';
import { useProductContext } from '../../context/productContext';

const VisorProducto = () => {
  const { productos } = useProductContext();

  const renderItem = ({ item, index }) => (
    <ProductoBar key={`${index}-${item.id}-${item.nombre}`} producto={item} />
  );

  const keyExtractor = (item, index) => `${index}-${item.id}-${item.nombre}`;

  return (
    <>
      <View style={styles.texto}>
        <Text>Espacio</Text>
      </View>
      {/* <FlatList
        data={productos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      /> */}
      <ScrollView nestedScrollEnabled>
        {productos.map((producto, index) => (
          <ProductoBar
            key={'' + index + producto.id + producto.nombre}
            producto={producto}
          />
        ))}
      </ScrollView>
    </>
  );
};

export default VisorProducto;

const styles = StyleSheet.create({
  texto: {
    height: 400,
  },
});
