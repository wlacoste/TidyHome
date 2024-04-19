import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { useTheme } from 'react-native-paper';
import Text from './Text';

export interface ICategoria {
  id: number;
  nombre: string;
}

const Categories = () => {
  const { categorias, loading: categoriasLoading } = useCategories();

  const theme = useTheme();

  console.log('categoriasLoading', categoriasLoading);
  if (categoriasLoading.getData) {
    return (
      <View>
        <Text>Cargando...</Text>
      </View>
    );
  }
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.text}>categoriassl</Text>

      {categorias &&
        categorias.map((i, index) => (
          <Text key={index + i.nombre}>{i.nombre}</Text>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'OxygenMono-Regular',
    fontSize: 15,
  },
});

export default Categories;
