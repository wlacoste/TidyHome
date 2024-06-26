import React, { useState } from 'react';
import { Button, Card, IconButton, MD3Colors, Text } from 'react-native-paper';
import { IMovimientoSimple, MovimientoProducto, Producto } from '../../models';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useProductContext } from '../../context/productContext';
import Collapsible from 'react-native-collapsible';

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
  const [open, setOpen] = useState(true);

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.leftSection}>
          <IconButton
            icon="chevron-down"
            size={24}
            style={styles.icon}
            onPress={() => setOpen(prev => !prev)}
          />
          <View>
            <Text style={styles.text}>{producto.nombre}</Text>
            <Text style={styles.textCategoria}>{producto.categoria}</Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <Button
            mode="contained"
            style={styles.buttonLeft}
            onPress={() => hacerMovimiento(false)}>
            -
          </Button>
          <Text style={styles.cantidad}>{cantidad}</Text>
          <Button
            mode="contained"
            style={styles.buttonRight}
            onPress={() => hacerMovimiento(true)}>
            +
          </Button>
        </View>
      </Card.Content>
      <Collapsible collapsed={open}>
        {producto.detalle.map((mov, index) => (
          <View id={'' + index + mov.id}>
            <Text>{mov.fechaCreacion}</Text>
            <Text>{mov.isCompra ? mov.cantidad : '-' + mov.cantidad}</Text>
          </View>
        ))}
      </Collapsible>
    </Card>
  );
};

export default ProductoBar;

const styles = StyleSheet.create({
  card: {
    margin: 5,
    paddingBottom: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginVertical: 0,
    paddingVertical: 0,
    marginRight: 8,
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
  },
  cantidad: {
    fontSize: 15,
  },
  buttonLeft: {
    padding: 0,
    margin: 0,
    marginLeft: 8,
    borderRadius: 0,
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
    width: 15,
  },
  buttonRight: {
    padding: 0,
    margin: 0,
    marginLeft: 8,
    borderRadius: 0,
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,
  },
});
