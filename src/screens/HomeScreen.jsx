import React from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';

const HomeScreen = () => {
  return (
    <View>
      <Text>HomeScreendd</Text>

      <Button
        icon="camera"
        mode="contained"
        onPress={() => console.log('Pressed')}>
        Press me
      </Button>
    </View>
  );
};

export default HomeScreen;
