import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { getAllProductsWithMovements } from '../../service/product-service';
import { Producto } from '../../models';
import ProductoBar from '../ProductoBar';
import { useProductContext } from '../../context/productContext';

const VisorProducto = () => {
  const { productos } = useProductContext();

  return (
    <View>
      {productos.map((producto, index) => (
        // <Card id={'' + index + producto.id}>
        //   <Text>{producto.nombre}</Text>
        //   <Text>{producto.categoria}</Text>
        // </Card>
        <ProductoBar producto={producto} />
      ))}
    </View>
  );
};

export default VisorProducto;
