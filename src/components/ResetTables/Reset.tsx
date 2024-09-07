import { View, Text } from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper';
import {
  createTables,
  deleteSpecifiedTables,
  insertDefaultProducts,
} from '../../service/product-service';
import { useProductContext } from '../../context/productContext';
import { useCategories } from '../../context/categoryContext';

export default function ResetTables() {
  const { refreshCategories } = useCategories();
  const { getProductos } = useProductContext();
  const reset = async () => {
    await deleteSpecifiedTables();
    await createTables();
    await refreshCategories();
    await getProductos();
  };

  const handleInsert = async () => {
    await insertDefaultProducts();
    await refreshCategories();
    await getProductos();
  };

  return (
    <View>
      <Button onPress={() => reset()}>ResetTables</Button>
      <Button onPress={() => handleInsert()}>Insert default productos</Button>
    </View>
  );
}
