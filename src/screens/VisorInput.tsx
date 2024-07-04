import React from 'react';
import { Button, Card, Text } from 'react-native-paper';
import { useSimpleInput } from '../context/simpleInputContext';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '../models/routeTypes';

const VisorInput = () => {
  const { products } = useSimpleInput();
  const navigation = useNavigation<RootNavigationProp>();

  if (!products || products.length == 0) {
    return (
      <>
        <Text>Sin productos</Text>
        <Button mode="contained" onPress={() => navigation.navigate('Test')}>
          TestView
        </Button>
      </>
    );
  }

  return (
    <Card>
      {products.map((producto, index) => (
        <Text key={index}>{producto}</Text>
      ))}
    </Card>
  );
};

export default VisorInput;
