import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useCategories } from '../../context/categoryContext';
import { Chip, MD3Theme, ThemeProvider, useTheme } from 'react-native-paper';

const getTheme = (seleccionado: boolean, theme: MD3Theme) => {
  if (theme.dark) {
    if (seleccionado) {
      return {
        backgroundColor: theme.colors.primaryContainer,
      };
    }
    return {
      backgroundColor: theme.colors.outlineVariant,
    };
  }
  if (seleccionado) {
    return {
      backgroundColor: theme.colors.primaryContainer,
    };
  }
  return {
    backgroundColor: theme.colors.surfaceVariant,
  };
};

interface IChipSelector {
  seleccionados: number[];
  setSeleccionados: React.Dispatch<React.SetStateAction<number[]>>;
}
const CategoryChipSelector = ({
  seleccionados,
  setSeleccionados,
}: IChipSelector) => {
  const { categories } = useCategories();

  //   const [seleccionados, setSeleccionados] = useState<number[]>([]);

  const theme = useTheme();

  const toggleSeleccion = (id: number, seleccionado: boolean) => {
    if (seleccionado) {
      return setSeleccionados(prev => prev.filter(item => item !== id));
    }
    return setSeleccionados(prev => [...prev, id]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.chipContainer}>
        {categories.map((categoria, index) => {
          const seleccionado = seleccionados.includes(categoria.id);
          return (
            <Chip
              key={`${index}-${categoria.id}-${categoria.name}`}
              icon={categoria.icon}
              style={[styles.chip, getTheme(seleccionado, theme)]}
              onPress={() =>
                toggleSeleccion(
                  categoria.id,
                  seleccionados.includes(categoria.id),
                )
              }
              selected={seleccionado}
              //   background={}
            >
              {categoria.name}
            </Chip>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 215, // Adjust this value to control the maximum height of the ScrollView
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
  },
  chip: {
    margin: 3,
  },
});

export default CategoryChipSelector;
