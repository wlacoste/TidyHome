import React, { useState } from 'react';
import { Card, Divider, IconButton, Text, useTheme } from 'react-native-paper';
import { IMovimientoSimple, MovimientoProducto, Producto } from '../../models';
import { StyleSheet, View } from 'react-native';
import { useProductContext } from '../../context/productContext';
import Collapsible from 'react-native-collapsible';
import Texto from '../Text';
import MovimientoDetalle from './MovimientoDetalle';

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
  const { agregarMovimiento } = useProductContext();
  const cantidad = producto.detalle.reduce((acc, transaction) => {
    return transaction.isCompra
      ? acc + transaction.cantidad
      : acc - transaction.cantidad;
  }, 0);

  const hacerMovimiento = (isCompra: boolean) => {
    const req: IMovimientoSimple = {
      idProducto: producto.id,
      isCompra: isCompra,
      ultimoMovimiento: producto.detalle[producto.detalle.length - 1],
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
          <IconButton
            icon={
              collapsed ? 'unfold-more-horizontal' : 'unfold-less-horizontal'
            }
            size={24}
            style={styles.icon}
            onPress={() => setCollapsed(prev => !prev)}
          />
          <View>
            <Text style={styles.text}>{producto.nombre}</Text>
            <Text style={styles.textCategoria}>{producto.categoria}</Text>
          </View>
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
      <Collapsible collapsed={collapsed}>
        {producto.detalle.map((mov, index) => (
          <>
            <Divider key={`div${index}${mov.id}`} horizontalInset />
            <MovimientoDetalle key={`${index}${mov.id}`} mov={mov} />
          </>
          // <View key={'' + index + mov.id}>
          //   <Text>{mov.fechaCreacion}</Text>
          //   <Text>{mov.isCompra ? mov.cantidad : '-' + mov.cantidad}</Text>
          // </View>
        ))}
      </Collapsible>
    </Card>
  );
};

export default ProductoBar;

const styles = StyleSheet.create({
  card: {
    margin: 5,
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
    marginLeft: -15,
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
    lineHeight: 12,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: 136,
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
    marginLeft: 8,
    width: 40,
    height: 40,
  },
  buttonRight: {
    padding: 0,
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
});
