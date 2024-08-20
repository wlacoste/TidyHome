import { View, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useProductContext } from '../../context/productContext';
import {
  ActivityIndicator,
  Button,
  Card,
  Checkbox,
  Divider,
  Icon,
  List,
  Text,
} from 'react-native-paper';
import { Producto } from '../../models/productos';
import SelectorCantidad from '../SelectorCantidad';
import { rgbToHex } from '../../utils/rgbToHex';
import { ItemCompra } from '../ListaComprasGenerada';

const ListaCompras = ({
  setLista,
}: {
  setLista: React.Dispatch<React.SetStateAction<ItemCompra[]>>;
}) => {
  const { productos, loading } = useProductContext();
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheckbox = id => {
    setCheckedItems(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleSubmit = () => {
    const selectedItems = productos.filter(item => checkedItems[item.id]);

    const lista = selectedItems.map(
      item =>
        ({
          item: item.nombre,
          quantity: 3,
        } as ItemCompra),
    );

    setLista(lista);
    // console.log(selectedItems);
  };

  // const [cantidad, setCantidad] = useState(5);

  if (loading) {
    return <ActivityIndicator />;
  }

  const renderItem = ({ item }: { item: Producto }) => (
    <List.Item
      style={styles.row}
      title={item.nombre}
      left={() => <Icon source={item.categoria.icon} size={15} />}
      right={() => (
        <View style={styles.rightContent}>
          <Checkbox
            status={checkedItems[item.id] ? 'checked' : 'unchecked'}
            onPress={() => toggleCheckbox(item.id)}
          />
          <SelectorCantidad
            cantidad={item.cantidadAdvertencia}
            onDecrement={() => {}}
            onIncrement={() => {}}
            styles={styles}
          />
        </View>
      )}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={productos}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <Button mode="contained" onPress={handleSubmit} style={{ margin: 16 }}>
        Submit
      </Button>
    </View>
  );
};

export default ListaCompras;

const styles = StyleSheet.create({
  row: {
    width: '100%',
    paddingHorizontal: 10,
    paddingRight: 10,
    borderBottomWidth: 0.6,
    borderBottomColor: rgbToHex('160, 160, 160'),
  },
  // selectores: {
  //   display: 'flex',
  //   flexDirection: 'row',
  //   width: '60%',
  //   borderWidth: 1,
  //   borderColor: 'red',
  // },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 150, // Adjust this value as needed
  },
  cantidad: {
    flex: 0,
    width: 30,
  },
});
