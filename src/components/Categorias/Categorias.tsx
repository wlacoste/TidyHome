import { StyleSheet, View } from 'react-native';
import React from 'react';
// import { useCategories } from '../../hooks/useCategories';
import { useTheme } from 'react-native-paper';
import Text from '../Text';
import { useCategories } from '../../context/categoryContext';

export interface ICategoria {
  id: number;
  nombre: string;
}

const Categories = () => {
  // const { categorias, loading: categoriasLoading } = useCategories();
  const { categories: categorias } = useCategories();

  const theme = useTheme();

  if (categorias.length === 0) {
    return (
      <View>
        <Text>Cargando...</Text>
      </View>
    );
  }
  return (
    <View style={[styles.container]}>
      <Text style={styles.text}>categoriassl</Text>

      {categorias &&
        categorias.map((i, index) => (
          <Text key={index + i.name}>{i.name}</Text>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'OxygenMono-Regular',
    fontSize: 15,
  },
});

export default Categories;
