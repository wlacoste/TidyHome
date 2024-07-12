import { View, Text } from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper';
import { deleteSpecifiedTables } from '../../service/product-service';

export default function ResetTables() {
  return (
    <View>
      <Button onPress={() => deleteSpecifiedTables()}>ResetTables</Button>
    </View>
  );
}
