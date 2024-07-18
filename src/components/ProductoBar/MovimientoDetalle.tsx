import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
import { MovimientoProducto } from '../../models/productos';

export interface IMovimientoDetalle {
  mov: MovimientoProducto;
  showDivider: boolean;
}

const MovimientoDetalle = ({ mov, showDivider }: IMovimientoDetalle) => {
  const theme = useTheme();
  return (
    <>
      {showDivider && <Divider horizontalInset />}
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
            {mov.fechaVencimiento && <Text>Vence: {mov.fechaVencimiento}</Text>}
            <Text>
              Valor: {mov.precioUnitario.toFixed(2)} x {mov.cantidad}
            </Text>
            <Text>Total: {(mov.precioUnitario * mov.cantidad).toFixed(2)}</Text>
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
