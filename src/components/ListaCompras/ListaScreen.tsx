import { StyleSheet, View } from 'react-native';
import React from 'react';
import ListaCompras from './ListaCompras';
import ListaCompraGenerada, { ItemCompra } from '../ListaComprasGenerada';
import { ScrollView } from 'react-native-gesture-handler';
import { useListasComprasDB } from '../../hooks/useListasComprasDB';
import { ActivityIndicator, useTheme } from 'react-native-paper';
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

  const theme = useTheme();
  if (isLoading) {
    return (
      <>
        <View style={styles.generador}>
          <ListaCompras setLista={handleNewLista} />
        </View>
        <ActivityIndicator />
      </>
    );
  }
  // if (listas.length === 0) {
  //   return (
  //     <>
  //       <View style={styles.generador}>
  //         <ListaCompras setLista={handleNewLista} />
  //       </View>
  //       <ScrollView style={{ borderWidth: 1 }}>
  //         <CatFallback
  //           titulo={
  //             'Productos agotandose o que hayas marcado apareceran arriba para que puedas generar una nueva lista'
  //           }
  //           numeroImagen={3}
  //           tituloStyle={{ color: theme.colors.onBackground, fontSize: 19 }}
  //         />
  //       </ScrollView>
  //     </>
  //   );
  // }
  return (
    <>
      <View style={styles.generador}>
        <ListaCompras setLista={handleNewLista} />
      </View>
      {listas.length === 0 ? (
        <ScrollView>
          <CatFallback
            titulo={
              'Productos agotandose o que hayas marcado apareceran arriba para que puedas generar una nueva lista'
            }
            tituloStyle={{ fontSize: 16 }}
            numeroImagen={3}
          />
        </ScrollView>
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
