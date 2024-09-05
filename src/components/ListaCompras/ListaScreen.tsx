import { LayoutAnimation, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import ListaCompras from './ListaCompras';
import ListaCompraGenerada, { ItemCompra } from '../ListaComprasGenerada';
import { formatDate } from '../../utils/formatDate';
import { ScrollView } from 'react-native-gesture-handler';
import { useListasCompras } from '../../hooks/useHandleListaCompras';
import { useListasComprasDB } from '../../hooks/useListasComprasDB';
import { ActivityIndicator } from 'react-native-paper';
import CatFallback from '../CatFallback';

export interface IListasCompras {
  id: string;
  items: ItemCompra[];
  fecha: string;
  titulo: string;
  comentario: string;
}

const ListaScreen = () => {
  const {
    listas,
    handleNewLista,
    agregarAlista,
    eliminarLista,
    cambiarNombre,
    isLoading,
  } = useListasComprasDB();
  return (
    <>
      <View style={styles.generador}>
        <ListaCompras setLista={handleNewLista} />
      </View>
      {isLoading ? (
        <ActivityIndicator />
      ) : listas.length === 0 ? (
        <View style={{ top: -100 }}>
          <CatFallback
            titulo={
              'Productos agotandose o que hayas marcado apareceran arriba para que puedas generar una nueva lista'
            }
            numeroImagen={3}
          />
        </View>
      ) : (
        <ScrollView style={styles.listaGenerada}>
          {listas.map(lista => (
            <ListaCompraGenerada
              key={lista.id}
              agregarItem={agregarAlista}
              items={lista}
              cambiarNombre={cambiarNombre}
              eliminarLista={eliminarLista}
            />
          ))}
        </ScrollView>
      )}
    </>
  );
};

export default ListaScreen;

const styles = StyleSheet.create({
  generador: {
    height: '50%',
    // marginBottom: 4,
  },
  listaGenerada: {
    height: '50%',
  },
});
