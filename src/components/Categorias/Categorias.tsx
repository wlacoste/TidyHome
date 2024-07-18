import { StyleSheet, View } from 'react-native';
import React from 'react';
// import { useCategories } from '../../hooks/useCategories';
import { Icon, useTheme } from 'react-native-paper';
import Text from '../Text';
import { useCategories } from '../../context/categoryContext';

export interface ICategoria {
  id: number;
  nombre: string;
}

const Categories = () => {
  // const { categorias, loading: categoriasLoading } = useCategories();
  const { categories: categorias, loading } = useCategories();

  const theme = useTheme();

  if (loading) {
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
          <View key={index + i.name}>
            <Text>{i.name}</Text>
            <Icon size={15} source={i.icon} />
          </View>
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
