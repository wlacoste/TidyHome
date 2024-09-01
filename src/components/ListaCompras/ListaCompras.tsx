import { View, StyleSheet } from 'react-native';
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
import SelectorCantidad from '../SelectorCantidad';
import { rgbToHex } from '../../utils/rgbToHex';
import { ItemCompra } from '../ListaComprasGenerada';
import CategoryChipSelector from '../CategorySelector/CategoryChipSelector';
import { useListaCompras } from '../../hooks/useListaCompras';
import { ScrollView } from 'react-native-gesture-handler';

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
      <View style={{}}>
        <ScrollView style={styles.lista}>
          {filteredProducts.map(item => {
            const productoState = getProductoState(item.id);

            return (
              <List.Item
                key={`${item.id}-${item.nombre}`}
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
          })}
        </ScrollView>
        <Button
          mode="contained"
          icon={'cart-plus'}
          onPress={handleSubmit}
          style={{
            margin: 5,

            marginHorizontal: 35,
            borderRadius: 8,
          }}>
          Generar lista de compras
        </Button>
      </View>
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
  lista: {
    height: '64%',
  },
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
