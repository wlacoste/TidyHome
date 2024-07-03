import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, IconButton, Text, useTheme } from 'react-native-paper';
import { MovimientoProducto } from '../../models';

export interface IMovimientoDetalle {
  mov: MovimientoProducto;
}

const MovimientoDetalle = ({ mov }: IMovimientoDetalle) => {
  const theme = useTheme();
  return (
    <>
      <Divider
        horizontalInset
        // style={{ backgroundColor: 'theme.colors.inverseSurface' }}
      />
      <View
        style={[
          styles.card,
          { backgroundColor: theme.colors.elevation.level1 },
        ]}>
        <View style={styles.left}>
          <View style={styles.conta}>
            <Text>{mov.isCompra ? 'Adquirido' : 'Consumido'}</Text>
            <Text>Fecha: {mov.fechaCreacion}</Text>
            <Text>Cantidad: {mov.cantidad}</Text>
          </View>
          <View style={styles.conta}>
            {mov.fechaVencimiento !== 'undefined' && (
              <Text>Vence: {mov.fechaVencimiento}</Text>
            )}
            <Text>
              Valor: {mov.precioUnitario} x {mov.cantidad}
            </Text>
            <Text>Total: {mov.precioUnitario * mov.cantidad}</Text>
            <Text>id: {mov.id}</Text>
          </View>
        </View>

        <View style={styles.opciones} />
      </View>
    </>
  );
};

export default MovimientoDetalle;

const styles = StyleSheet.create({
  card: {
    height: 88,
    padding: 5,
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
    borderRadius: 4,
    marginHorizontal: 4,
    width: 40,
    height: 40,
  },
});
