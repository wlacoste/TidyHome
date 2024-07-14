import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductoList } from '../models/routeTypes';
import ProductoDetalle from '../components/ProductoDetalle/ProductoDetalle';
import VisorProducto from '../components/VisorProducto/VisorProducto';

const ProductoStack = createNativeStackNavigator<ProductoList>();

function ProductStackNavigator() {
  return (
    <ProductoStack.Navigator>
      <ProductoStack.Screen
        name="Producto"
        component={VisorProducto}
        options={{ title: 'Productos', headerShown: false }}
      />

      <ProductoStack.Screen
        name="ProductoDetalle"
        component={ProductoDetalle}
        options={{ title: 'Detalle' }}
      />
    </ProductoStack.Navigator>
  );
}

export default ProductStackNavigator;
