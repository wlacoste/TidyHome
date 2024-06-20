import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { getAllProductsWithMovements } from '../../service/product-service';
import { Producto } from '../../models';
import ProductoBar from '../ProductoBar';

const VisorProducto = () => {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    const getProductos = async () => {
      const p = await getAllProductsWithMovements();
      console.log('as', p);
      setProductos(p);
    };

    getProductos();
  }, []);

  return (
    <View>
      <Text>Productos</Text>
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
