import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import ListaCompras from './ListaCompras';

const ListaScreen = () => {
  return (
    <View style={styles.generador}>
      <ListaCompras />
    </View>
  );
};

export default ListaScreen;

const styles = StyleSheet.create({
  generador: {
    height: '50%',
  },
});
