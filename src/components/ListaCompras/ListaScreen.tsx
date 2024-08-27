import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import ListaCompras from './ListaCompras';
import ListaCompraGenerada, { ItemCompra } from '../ListaComprasGenerada';
import { formatDate } from '../../utils/formatDate';
import { ScrollView } from 'react-native-gesture-handler';

export interface IListasCompras {
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
    setListas(prev => [newList, ...prev]);
  };
  const agregarAlista = (item: string, idLista: string, cantidad?: number) => {
    let lista = listas.find(l => l.id === idLista);
    if (!lista) {
      return;
    }
    lista.items = [
      ...lista.items,
      { item: item, id: 0, cantidad: cantidad ? cantidad : 1 },
    ];

    setListas(prev => prev.map(p => (p.id === idLista ? lista : p)));
  };

  return (
    <>
      <View style={styles.generador}>
        <ListaCompras setLista={handleNewLista} />
      </View>
      <ScrollView style={styles.generador}>
        {listas.map(lista => (
          <ListaCompraGenerada
            key={lista.id}
            agregarItem={agregarAlista}
            items={lista}
          />
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
