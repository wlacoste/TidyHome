import React from 'react';
import { Button, Card, IconButton, MD3Colors, Text } from 'react-native-paper';
import { Producto } from '../../models';
import { StyleSheet, View } from 'react-native';

interface IProductoBar {
  producto: Producto;
}
const ProductoBar = ({ producto }: IProductoBar) => {
  const cantidad = producto.detalle.reduce((acc, transaction) => {
    return transaction.isCompra
      ? acc + transaction.cantidad
      : acc - transaction.cantidad;
  }, 0);
  console.log(producto);

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.leftSection}>
          <IconButton icon="chevron-down" size={24} style={styles.icon} />
          <View>
            <Text style={styles.text}>{producto.nombre}</Text>
            <Text style={styles.textCategoria}>{producto.categoria}</Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <Button mode="contained" style={styles.buttonLeft}>
            -
          </Button>
          <Text style={styles.cantidad}>{cantidad}</Text>
          <Button mode="contained" style={styles.buttonRight}>
            +
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

export default ProductoBar;

const styles = StyleSheet.create({
  card: {
    margin: 5,
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
    borderWidth: 1,
    borderColor: 'red',
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
