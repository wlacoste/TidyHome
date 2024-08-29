import { LayoutAnimation, StyleSheet, Text, View } from 'react-native';
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
  const [listas, setListas] = useState<IListasCompras[]>([]);

  const handleNewLista = (items: ItemCompra[]) => {
    const newList = {
      id: Date.now().toString(),
      items: items,
      fecha: formatDate(new Date()),
    };
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setListas(prev => prev.map(p => (p.id === idLista ? lista : p)));
  };
  const eliminarLista = (idLista: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setListas(prev => prev.filter(lista => lista.id !== idLista));
  };

  return (
    <>
      <View style={styles.generador}>
        <ListaCompras setLista={handleNewLista} />
      </View>
      <ScrollView style={styles.listaGenerada}>
        {listas.map(lista => (
          <ListaCompraGenerada
            key={lista.id}
            agregarItem={agregarAlista}
            items={lista}
            eliminarLista={eliminarLista}
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
    marginBottom: 4,
  },
  listaGenerada: {
    height: '700%',
  },
});
