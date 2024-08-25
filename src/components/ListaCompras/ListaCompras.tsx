import { View, FlatList, StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useProductContext } from '../../context/productContext';
import {
  ActivityIndicator,
  Button,
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
import { calculateTotal } from '../GestorProductos/ProductoBar';
import CategoryChipSelector from '../CategorySelector/CategoryChipSelector';

interface CantidadItem {
  idProducto: number;
  cantidadAComprar: number;
  checked: boolean;
  nombre: string;
}

const getCantidadAComprar = (producto: Producto) => {
  let cantidad = 1;
  if (
    producto.cantidadAdvertencia &&
    calculateTotal(producto.detalle) < producto.cantidadAdvertencia
  ) {
    cantidad = producto.cantidadAdvertencia - calculateTotal(producto.detalle);
  }
  return cantidad;
};
const ListaCompras = ({
  setLista,
}: {
  setLista: React.Dispatch<React.SetStateAction<ItemCompra[]>>;
}) => {
  const { productos, loading } = useProductContext();
  const [checkedItems, setCheckedItems] = useState({});
  const [itemsCompra, setItemsCompra] = useState<Producto[]>([]);
  const [filteredProducts, setFilteredProducts] = useState(productos);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [cantidades, setCantidades] = useState<CantidadItem[]>([]);

  const theme = useTheme();

  useEffect(() => {
    if (productos.length == 0) {
      return;
    }
    let items = productos.filter(
      producto =>
        producto.agregarListaCompra ||
        (producto.cantidadAdvertencia &&
          producto.cantidadAdvertencia >= calculateTotal(producto.detalle)) ||
        calculateTotal(producto.detalle) <= 0,
    );
    setItemsCompra(items);
  }, [productos]);

  useEffect(() => {
    setCantidades(
      filteredProducts.map(producto => ({
        idProducto: producto.id,
        cantidadAComprar: getCantidadAComprar(producto),
        checked: true,
        nombre: producto.nombre,
      })),
    );
  }, [filteredProducts]);

  useEffect(() => {
    if (seleccionados.length === 0) {
      return setFilteredProducts(itemsCompra);
    }
    let filtrados = itemsCompra.filter(product =>
      seleccionados.includes(product.categoria.id),
    );

    setFilteredProducts(filtrados);
  }, [itemsCompra, seleccionados]);

  const getProductoState = useCallback(
    (productoId: number): CantidadItem | undefined => {
      return cantidades.find(item => item.idProducto === productoId);
    },
    [cantidades],
  );

  const updateProductoState = (
    productoId: number,
    updates: Partial<CantidadItem>,
  ) => {
    setCantidades(prevState =>
      prevState.map(item =>
        item.idProducto === productoId ? { ...item, ...updates } : item,
      ),
    );
  };

  const handleIncrement = (productoId: number) => {
    const currentCantidad = getProductoState(productoId)?.cantidadAComprar || 0;
    updateProductoState(productoId, { cantidadAComprar: currentCantidad + 1 });
  };

  const handleDecrement = (productoId: number) => {
    const currentCantidad = getProductoState(productoId)?.cantidadAComprar || 0;
    if (currentCantidad > 0) {
      updateProductoState(productoId, {
        cantidadAComprar: currentCantidad - 1,
      });
    }
  };

  const toggleCheckbox = (productoId: number) => {
    updateProductoState(productoId, {
      checked: !getProductoState(productoId)?.checked,
    });
  };

  const handleSubmit = () => {
    const lista: ItemCompra[] = cantidades
      .filter(item => item.checked)
      .map(item => ({
        id: item.idProducto,
        cantidad: item.cantidadAComprar,
        item: item.nombre,
      }));
    setLista(lista);
  };

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
    <View style={{ flex: 1, justifyContent: 'flex-start' }}>
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
