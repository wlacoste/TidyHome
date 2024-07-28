import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductoList } from '../models/routeTypes';
import ProductoDetalle from '../components/GestorProductos/ProductoDetalle/ProductoDetalle';
import VisorProducto from '../screens/VisorProducto';
import ProductForm from '../components/GestorProductos/ProductForm';
import TestView from '../components/TestView/TestView';
import ProductFormPage from '../components/GestorProductos/ProductForm/ProductFormPage';

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
        options={({ route }) => ({
          // title: route.params.producto.nombre,
          title: 'Detalles',
          headerShown: false,
        })}
      />
      <ProductoStack.Screen
        name="ProductoForm"
        component={ProductFormPage}
        options={({ route }) => ({
          title: 'Nuevo Producto',
          // headerShown: false,
        })}
      />

      {/* Add other settings screens here */}
    </ProductoStack.Navigator>
  );
}

export default ProductStackNavigator;
