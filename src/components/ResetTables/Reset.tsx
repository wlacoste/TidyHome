import { View, Text } from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper';
import {
  createTables,
  deleteSpecifiedTables,
  insertDefaultProducts,
} from '../../service/product-service';

export default function ResetTables() {
  const reset = async () => {
    await deleteSpecifiedTables();
    await createTables();
  };

  return (
    <View>
      <Button onPress={() => reset()}>ResetTables</Button>
      <Button onPress={() => insertDefaultProducts()}>
        Insert default productos
      </Button>
    </View>
  );
}
