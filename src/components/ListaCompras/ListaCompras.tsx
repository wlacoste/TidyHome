import { View, FlatList, StyleSheet } from 'react-native';
import React from 'react';
import {
  ActivityIndicator,
  Button,
  Card,
  Checkbox,
  Divider,
  Icon,
  List,
  useTheme,
} from 'react-native-paper';
import { Producto } from '../../models/productos';
import SelectorCantidad from '../SelectorCantidad';
import { rgbToHex } from '../../utils/rgbToHex';
import { ItemCompra } from '../ListaComprasGenerada';
import CategoryChipSelector from '../CategorySelector/CategoryChipSelector';
import { useListaCompras } from '../../hooks/useListaCompras';

const ListaCompras = ({
  setLista,
}: {
  setLista: (items: ItemCompra[]) => void;
}) => {
  const {
    loading,
    getProductoState,
    toggleCheckbox,
    handleDecrement,
    handleIncrement,
    seleccionados,
    filteredProducts,
    handleSubmit,
    setSeleccionados,
  } = useListaCompras(setLista);

  const theme = useTheme();

  if (loading) {
    return <ActivityIndicator />;
  }

  const renderItem = ({ item }: { item: Producto }) => {
    const productoState = getProductoState(item.id);

    return (
      <List.Item
        style={styles.row}
        title={item.nombre}
        titleStyle={{ marginLeft: -4 }}
        left={() => (
          <View
            style={[
              styles.iconoItem,
              { backgroundColor: theme.colors.onPrimary },
            ]}>
            <Icon
              source={item.categoria.icon}
              size={18}
              color={item.categoria.color}
            />
          </View>
        )}
        right={() => (
          <View style={styles.rightContent}>
            <Checkbox
              status={productoState?.checked ? 'checked' : 'unchecked'}
              onPress={() => toggleCheckbox(item.id)}
            />
            <SelectorCantidad
              cantidad={productoState?.cantidadAComprar || 1}
              onDecrement={() => handleDecrement(item.id)}
              onIncrement={() => handleIncrement(item.id)}
              styles={styles}
            />
          </View>
        )}
      />
    );
  };

  return (
    <Card
      style={{ flex: 1, justifyContent: 'flex-start', marginHorizontal: 10 }}>
      <View>
        <CategoryChipSelector
          seleccionados={seleccionados}
          setSeleccionados={setSeleccionados}
        />
      </View>
      <Divider />

      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <Button
        mode="contained"
        icon={'cart-plus'}
        onPress={handleSubmit}
        style={{ margin: 16, marginHorizontal: 40, borderRadius: 8 }}>
        Generar lista de compras
      </Button>
    </Card>
  );
};

export default ListaCompras;

const styles = StyleSheet.create({
  row: {
    width: '100%',
    paddingHorizontal: 10,
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
  iconoItem: {
    alignSelf: 'center',
    padding: 5,
    borderRadius: 20,
    elevation: 5,
  },
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
