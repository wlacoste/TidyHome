import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import ListaCompras from './ListaCompras';
import ListaCompraGenerada, { ItemCompra } from '../ListaComprasGenerada';
import CategoryChipSelector from '../CategorySelector/CategoryChipSelector';

const ListaScreen = () => {
  const [lista, setLista] = useState<ItemCompra[]>([]);

  return (
    <>
      <View style={styles.generador}>
        <ListaCompras setLista={setLista} />
      </View>
      <View style={styles.generador}>
        <ListaCompraGenerada items={lista} />
      </View>
    </>
  );
};

export default ListaScreen;

const styles = StyleSheet.create({
  generador: {
    height: '50%',
  },
});
