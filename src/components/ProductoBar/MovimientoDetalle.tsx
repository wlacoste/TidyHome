import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { MovimientoProducto } from '../../models';

export interface IMovimientoDetalle {
  mov: MovimientoProducto;
}

const MovimientoDetalle = ({ mov }: IMovimientoDetalle) => {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.conta}>
          {/* <Text>Id: {mov.id}</Text> */}
          <Text>{mov.isCompra ? 'Adquirido' : 'Consumido'}</Text>
          <Text>Fecha: {mov.fechaCreacion}</Text>
          <Text>Cantidad: {mov.isCompra ? mov.cantidad : mov.cantidad}</Text>
        </View>
        <View style={styles.conta}>
          {mov.fechaVencimiento !== 'undefined' && (
            <Text>Vence: {mov.fechaVencimiento}</Text>
          )}
          <Text>
            Valor: {mov.precioUnitario} x {mov.cantidad}
          </Text>
          <Text>Total: {mov.precioUnitario * mov.cantidad}</Text>
        </View>
      </View>

      <View style={styles.opciones}>
        <IconButton
          mode="contained"
          style={styles.buttonLeft}
          onPress={() => {}}
          icon="playlist-edit"
        />
        <IconButton
          //   containerColor={theme.colors.primaryContainer}
          //   iconColor={theme.colors.primary}
          mode="outlined"
          style={styles.buttonLeft}
          //   style={styles.buttonRight}
          onPress={() => {}}
          icon="delete"
        />
      </View>
    </View>
  );
};

export default MovimientoDetalle;

const styles = StyleSheet.create({
  card: {
    margin: 5,
    padding: 3,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  left: {
    display: 'flex',
    flexDirection: 'row',
    width: '66%',
  },
  conta: {
    width: '50%',
  },
  opciones: {
    width: '25%',
    display: 'flex',
    flexDirection: 'row',
  },

  buttonLeft: {
    // padding: 0,
    // margin: 0,
    borderRadius: 4,
    marginHorizontal: 4,
    width: 40,
    height: 40,
  },
});
