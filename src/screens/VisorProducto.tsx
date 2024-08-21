import React, { useEffect, useState } from 'react';
import { Image, Keyboard, ScrollView, StyleSheet, View } from 'react-native';

import ProductoBar from '../components/GestorProductos/ProductoBar';
import { useProductContext } from '../context/productContext';
import { ActivityIndicator, Searchbar, Text } from 'react-native-paper';
import { useFab } from '../context/fabContext';
import CategoryChipSelector from '../components/CategorySelector/CategoryChipSelector';
import imagen from '../../assets/img/cat-mascot.png';

const VisorProducto = () => {
  const { productos, loading } = useProductContext();

  const { showFab } = useFab();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredProducts, setFilteredProducts] = useState(productos);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    let filtered = productos.filter(product =>
      product.nombre.toLowerCase().includes(lowercasedQuery),
    );
    if (seleccionados.length > 0) {
      filtered = filtered.filter(product =>
        seleccionados.includes(product.categoria.id),
      );
    }
    setFilteredProducts(filtered);
  }, [searchQuery, productos, seleccionados]);

  useEffect(() => {
    showFab();
    // return () => hideFab(); // Hide when unmounting
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        style={styles.loading}
        animating={true}
        size={'large'}
      />
    );
  }
  if (productos.length === 0) {
    return (
      <View style={styles.mensaje}>
        <Image source={imagen} style={styles.avatar} />

        <Text variant="titleLarge" style={styles.textomensaje}>
          Aún no tenés productos.
        </Text>
        <Text variant="titleLarge" style={styles.textomensaje}>
          Podes añadirlos y empezar a trackearlos!
        </Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.buscador}>
        <Text children={undefined} />
      </View>
      <CategoryChipSelector
        seleccionados={seleccionados}
        setSeleccionados={setSeleccionados}
      />

      <Searchbar
        placeholder="Buscar"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.search}
        onBlur={() => Keyboard.dismiss()}
        // textAlign="center"
        // textAlignVertical="center"
      />
      <ScrollView nestedScrollEnabled style={styles.contenedor}>
        {filteredProducts.map((producto, index) => (
          <ProductoBar
            key={`${index}-${producto.id}-${producto.nombre}`}
            producto={producto}
          />
        ))}
      </ScrollView>
    </>
  );
};

export default VisorProducto;

const styles = StyleSheet.create({
  buscador: {
    height: 20,
  },
  search: {
    marginHorizontal: 10,
    marginVertical: 5,
    height: 50,
    // textAlign: 'center',
    // textAlignVertical: 'center',
    // justifyContent: 'center',
    // alignContent: 'center',
    // alignItems: 'center',
    // textDecorationColor: 'red',
    // paddingBottom: 10,
    verticalAlign: 'middle',

    //
  },
  contenedor: {
    // paddingTop: 10,
  },
  loading: {
    flexGrow: 1,
  },
  mensaje: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '10%',
    paddingTop: '30%',
    gap: 10,
    textAlign: 'left',
  },
  avatar: {
    height: 200,
    width: 200,
  },
  textomensaje: {
    textAlign: 'center',
    fontWeight: '800',
  },
});
