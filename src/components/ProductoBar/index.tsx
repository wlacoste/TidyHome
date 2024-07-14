import React, { useState } from 'react';
import {
  Button,
  Card,
  Divider,
  Icon,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';
import {
  IMovimientoSimple,
  MovimientoProducto,
  Producto,
} from '../../models/productos';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useProductContext } from '../../context/productContext';
import Collapsible from 'react-native-collapsible';
import Texto from '../Text';
import MovimientoDetalle from './MovimientoDetalle';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useModal } from '../../context/modalContext';
import ProductForm from '../ProductForm';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '../../models/routeTypes';

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
  const { agregarMovimiento, eliminarMovimiento } = useProductContext();
  const cantidad = producto.detalle.reduce((acc, transaction) => {
    return transaction.isCompra
      ? acc + transaction.cantidad
      : acc - transaction.cantidad;
  }, 0);
  const { openModal, closeModal } = useModal();
  const navigation = useNavigation<RootNavigationProp>();

  const hacerMovimiento = (isCompra: boolean) => {
    if (!producto.detalle.length) {
      openModal(
        <ProductForm
          tipo={'update'}
          onClose={closeModal}
          producto={producto}
        />,
      );
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
    agregarMovimiento(req);
  };
  const [collapsed, setCollapsed] = useState(true);
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.leftSection}>
          {/* <IconButton
            icon={
              collapsed ? 'unfold-more-horizontal' : 'unfold-less-horizontal'
            }
            size={24}
            style={styles.icon}
            onPress={() => setCollapsed(prev => !prev)}
          /> */}
          <View style={styles.leftSectionContent}>
            <Text style={styles.text}>
              {producto.nombre.charAt(0).toUpperCase() +
                producto.nombre.slice(1)}
            </Text>
            <View style={styles.categoriaContainer}>
              <Icon source={producto.categoria.icon} size={12} />
              <Text style={styles.textCategoria}>
                {producto.categoria.name}
              </Text>
            </View>
          </View>
          <IconButton
            style={styles.buttonChev}
            icon={'chevron-right'}
            onPress={() => navigation.navigate('ProductoDetalle', { producto })}
          />
        </View>

        <View style={styles.rightSection}>
          <IconButton
            mode="contained"
            style={styles.buttonLeft}
            onPress={() => hacerMovimiento(false)}
            icon="minus"
          />
          <Text style={[styles.cantidad]}>{cantidad}</Text>
          <IconButton
            containerColor={theme.colors.primaryContainer}
            iconColor={theme.colors.primary}
            mode="contained"
            style={styles.buttonRight}
            onPress={() => hacerMovimiento(true)}
            icon="plus"
          />
        </View>
      </Card.Content>
      {/* <Collapsible collapsed={collapsed}>
        <SwipeListView
          keyExtractor={(item, index) => item.id.toString()}
          data={producto.detalle}
          renderItem={data => <MovimientoDetalle mov={data.item} />}
          style={styles.contenedorDetalle}
          renderHiddenItem={(data, rowMap) => (
            <View style={[styles.hiddenContainer]}>
              <View
                style={[
                  styles.xscroll,
                  styles.leftScroll,
                  {
                    backgroundColor: theme.colors.inverseSurface,
                  },
                ]}>
                <IconButton
                  icon="trash-can-outline"
                  iconColor={theme.colors.onPrimary}
                  size={35}
                  onPress={() => {
                    eliminarMovimiento(data.item.id);
                  }}
                />
              </View>
              <View
                style={[
                  styles.xscroll,
                  styles.rightScroll,
                  {
                    backgroundColor: theme.colors.primary,
                  },
                ]}>
                <IconButton
                  icon="playlist-edit"
                  iconColor={theme.colors.onPrimary}
                  size={35}
                  onPress={() => {}}
                />
              </View>
            </View>
          )}
          leftOpenValue={75}
          rightOpenValue={-75}
          scrollEnabled={true}
          disableScrollViewPanResponder={true}
          nestedScrollEnabled={true}
        />
      </Collapsible> */}
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
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',

    // marginLeft: -15,
  },
  leftSectionContent: {
    // padding: 0,
    // marginTop: 0,
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
  rightSection: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: 132,
  },
  cantidad: {
    fontSize: 20,
    fontWeight: '700',
    textAlignVertical: 'center',
    width: 30,

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
    marginLeft: 5,
    margin: 0,
    width: 40,
    height: 40,
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
