import React, { useState } from 'react';
import {
  Card,
  Icon,
  IconButton,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {
  IMovimientoSimple,
  MovimientoProducto,
  Producto,
} from '../../../models/productos';
import { StyleSheet, View } from 'react-native';
import { useProductContext } from '../../../context/productContext';
import { useModal } from '../../../context/modalContext';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '../../../models/routeTypes';
import PrimerMovimiento from '../ProductForm/NuevoMovimiento';
import SelectorCantidad from '../../SelectorCantidad';

interface IProductoBar {
  producto: Producto;
}

export function calculateTotal(items: MovimientoProducto[]): number {
  return items.reduce((total, item) => {
    if (item.isCompra) {
      return total + item.cantidad;
    } else {
      return total - item.cantidad;
    }
  }, 0);
}
const ProductoBar = ({ producto }: IProductoBar) => {
  const { agregarMovimiento, agregarACompraToggle } = useProductContext();
  const cantidad = producto.detalle.reduce((acc, transaction) => {
    return transaction.isCompra
      ? acc + transaction.cantidad
      : acc - transaction.cantidad;
  }, 0);
  const { openModal, closeModal } = useModal();
  const navigation = useNavigation<RootNavigationProp>();

  const hacerMovimiento = (isCompra: boolean) => {
    if (!producto.detalle.length) {
      openModal(<PrimerMovimiento onClose={closeModal} producto={producto} />);
      return;
    }
    const req: IMovimientoSimple = {
      idProducto: producto.id,
      isCompra: isCompra,
      ultimoMovimiento: producto.detalle.reduce((max, obj) =>
        obj.id > max.id ? obj : max,
      ),
      cantidadActual: calculateTotal(producto.detalle),
    };
    console.log('req', req);
    agregarMovimiento(req);
  };
  const [collapsed, setCollapsed] = useState(true);
  const theme = useTheme();

  console.log('preoductoBar', producto);
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <TouchableRipple
          style={[
            styles.leftSection,
            {
              borderColor: producto.categoria.color
                ? producto.categoria.color
                : theme.colors.outlineVariant,
            },
          ]}
          onPress={() =>
            navigation.navigate('ProductoDetalle', {
              productoId: producto.id,
            })
          }>
          <>
            <View style={styles.buttonChev}>
              <Icon
                source={producto.categoria.icon}
                size={25}
                color={
                  producto.categoria.color
                    ? producto.categoria.color
                    : undefined
                }
              />
            </View>
            <View style={styles.leftSectionContent}>
              <Text
                style={[styles.text, { flexShrink: 1 }]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {producto.nombre.charAt(0).toUpperCase() +
                  producto.nombre.slice(1)}
              </Text>
              <View style={styles.categoriaContainer}>
                {/* <Icon source={producto.categoria.icon} size={12} /> */}
                <Text style={styles.textCategoria}>
                  {producto.categoria.name}
                </Text>
              </View>
            </View>
          </>
        </TouchableRipple>
        <View
          style={{
            paddingHorizontal: 15,
            width: '30%',
            display: 'flex',
            flexDirection: 'row',
          }}>
          <IconButton
            mode="contained"
            iconColor={
              producto.agregarListaCompra
                ? theme.colors.error
                : theme.colors.outline
            }
            style={[
              styles.iconoCompra,
              { backgroundColor: theme.colors.elevation.level1 },
            ]}
            onPress={() => {
              agregarACompraToggle(producto);
            }}
            icon="cart-heart"
          />
        </View>
        <SelectorCantidad
          cantidad={cantidad}
          onDecrement={() => hacerMovimiento(false)}
          onIncrement={() => hacerMovimiento(true)}
        />
      </Card.Content>
    </Card>
  );
};

export default ProductoBar;

const styles = StyleSheet.create({
  card: {
    margin: 5,
    // borderColor: 'red',
    // borderWidth: 1,
    // paddingBottom: 10,
    borderRadius: 12,
  },
  iconoCompra: {
    height: 30,
    marginLeft: 0,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 7,
    paddingTop: 7,
    paddingLeft: 10,
  },
  leftSection: {
    // margin: 10,
    // elevation: 1,
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'flex-start',

    textAlign: 'center',
    borderWidth: 0.5,
    padding: 3,
    paddingLeft: 5,
    borderRadius: 7,
    // marginTop: 7,
    // marginBottom: 7,
    marginLeft: 0,
  },
  leftSectionContent: {
    width: '80%',
  },
  rightSection: {
    // alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '32%',
  },
  categoriaContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 3,
  },
  icon: {
    marginVertical: 0,
    paddingVertical: 0,
    marginRight: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  textCategoria: {
    fontSize: 12,
    lineHeight: 13,
  },
  cantidad: {
    fontSize: 20,
    fontWeight: '700',
    textAlignVertical: 'center',
    width: '100%',

    textAlign: 'center',

    height: 40,
    flex: 1,
  },
  buttonLeft: {
    padding: 0,
    margin: 0,
    // marginLeft: 8,
    width: 40,
    height: 40,
  },
  buttonRight: {
    padding: 0,
    margin: 0,
    width: 40,
    height: 40,
  },
  buttonChev: {
    padding: 0,
    margin: 0,
    paddingRight: 5,
    justifyContent: 'center',
    // width: '100%',
  },

  buttonText: {
    lineHeight: 29,
    fontSize: 35,
  },
  buttonTextPlus: {
    lineHeight: 26,
    fontSize: 28,
  },
  hiddenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    flex: 1,
  },
  contenedorDetalle: {
    maxHeight: 360,
    overflow: 'scroll',
  },
  xscroll: {
    height: 86,
    justifyContent: 'center',
    width: '50%',
    marginTop: 1,
  },
  rightScroll: {
    alignItems: 'flex-end',
  },
  leftScroll: {
    alignItems: 'flex-start',
    paddingLeft: 5,
  },
});
