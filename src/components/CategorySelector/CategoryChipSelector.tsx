import { View, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Icon, MD3Theme, useTheme } from 'react-native-paper';
import MaterialChip from 'react-native-material-chip';
// import { useProductos } from '../../hooks/useProductos';
import { Categoria } from '../../models/categorias';
import { useProductContext } from '../../context/productContext';

const getTheme = (seleccionado: boolean, theme: MD3Theme) => {
  if (theme.dark) {
    if (seleccionado) {
      return {
        backgroundColor: theme.colors.onPrimaryContainer,
        color: theme.colors.inverseSurface,
      };
    }
    return {
      backgroundColor: theme.colors.outlineVariant,
      color: theme.colors.inverseSurface,
    };
  }
  if (seleccionado) {
    return {
      backgroundColor: theme.colors.primaryContainer,
      color: theme.colors.onSurfaceVariant,
    };
  }
  return {
    backgroundColor: theme.colors.surfaceVariant,
    color: theme.colors.onSurfaceVariant,
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
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const { productos } = useProductContext();
  useEffect(() => {
    if (productos.length === 0) {
      return;
    }
    let cate = [...new Set(productos.map(prod => prod.categoria))].sort(
      (a, b) => a.ordenCategoria - b.ordenCategoria,
    );

    setCategorias(cate);
  }, [productos]);

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
        {categorias.map((categoria, index) => {
          const seleccionado = seleccionados.includes(categoria.id);
          return (
            <MaterialChip
              text={categoria.name}
              key={`${index}-${categoria.id}-${categoria.name}`}
              style={[
                styles.chip,
                getTheme(seleccionado, theme),
                { borderColor: categoria.color },
              ]}
              textStyle={[
                getTheme(seleccionado, theme),
                {
                  fontWeight: '600',
                },
              ]}
              leftIcon={
                <View
                  style={{
                    height: MaterialChip.CHIP_LEFT_ICON_SIZE,
                    width: MaterialChip.CHIP_LEFT_ICON_SIZE,
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: categoria.color,
                  }}>
                  <Icon
                    source={categoria.icon}
                    size={18}
                    color={categoria.color}
                  />
                </View>
              }
              onPress={() =>
                toggleSeleccion(
                  categoria.id,
                  seleccionados.includes(categoria.id),
                )
              }
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 90,
    maxHeight: 215, // Adjust this value to control the maximum height of the ScrollView
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
  },
  chip: {
    paddingVertical: 0,
    gap: 20,
    margin: 2,
  },
});

export default CategoryChipSelector;
