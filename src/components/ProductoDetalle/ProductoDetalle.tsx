import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProductoList } from '../../models/routeTypes';

type Props = NativeStackScreenProps<ProductoList, 'ProductoDetalle'>;

const ProductoDetalle: React.FC<Props> = ({ route }) => {
  const { producto } = route.params;

  return (
    <View>
      <Text>ProductoDetalle</Text>
      <Text>{producto.nombre}</Text>
    </View>
  );
};

export default ProductoDetalle;
