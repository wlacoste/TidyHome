import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Text } from 'react-native-paper';

export default function About() {
  return (
    <View style={styles.container}>
      <Text>Clean App v0.1</Text>
      <Text>Desarrollado por Walter Lacoste</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});
