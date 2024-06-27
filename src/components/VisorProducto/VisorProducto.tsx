import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { getAllProductsWithMovements } from '../../service/product-service';
import { Producto } from '../../models';
import ProductoBar from '../ProductoBar';
import { useProductContext } from '../../context/productContext';

const VisorProducto = () => {
  const { productos } = useProductContext();

  return (
    <ScrollView>
      <View>
        {productos.map((producto, index) => (
          <ProductoBar
            key={'' + index + producto.id + producto.nombre}
            producto={producto}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default VisorProducto;
