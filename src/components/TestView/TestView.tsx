import { View } from 'react-native';
import React from 'react';
import { useSimpleContext } from '../../context/simpleContext';
import { Text } from 'react-native-paper';

const TestView = () => {
  const { texto } = useSimpleContext();
  return (
    <View>
      <Text>TestView</Text>
      <Text>{texto}</Text>
    </View>
  );
};

export default TestView;
