import React from 'react';
import { Card, Text } from 'react-native-paper';
import { useSimpleInput } from '../context/simpleInputContext';

const VisorInput = () => {
  const { products } = useSimpleInput();

  if (!products || products.length == 0) {
    return <Text>Sin productos</Text>;
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
