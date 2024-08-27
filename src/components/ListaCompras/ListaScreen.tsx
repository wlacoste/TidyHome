import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import ListaCompras from './ListaCompras';
import ListaCompraGenerada, { ItemCompra } from '../ListaComprasGenerada';
import { formatDate } from '../../utils/formatDate';
import { ScrollView } from 'react-native-gesture-handler';

interface IListasCompras {
  id: string;
  items: ItemCompra[];
  fecha: string;
}
const ListaScreen = () => {
  const [listas, setListas] = useState<IListasCompras[]>([]); // Update the state type

  const handleNewLista = (items: ItemCompra[]) => {
    const newList = {
      id: Date.now().toString(), // Generate a unique ID
      items: items,
      fecha: formatDate(new Date()),
    };
    console.log(newList.fecha);
    setListas(prev => [newList, ...prev]);
  };

  return (
    <>
      <View style={styles.generador}>
        <ListaCompras setLista={handleNewLista} />
      </View>
      <ScrollView style={styles.generador}>
        {listas.map(lista => (
          <ListaCompraGenerada key={lista.id} items={lista.items} />
        ))}
      </ScrollView>
    </>
  );
};

export default ListaScreen;

const styles = StyleSheet.create({
  generador: {
    height: '50%',
  },
});
