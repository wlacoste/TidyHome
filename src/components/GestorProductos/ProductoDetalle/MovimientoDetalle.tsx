import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Divider,
  Icon,
  IconButton,
  MD3Theme,
  Text,
  useTheme,
} from 'react-native-paper';
import { MovimientoProducto } from '../../../models/productos';
import { useProductContext } from '../../../context/productContext';

export interface IMovimientoDetalle {
  mov: MovimientoProducto;
  showDivider?: boolean;
  theme: MD3Theme;
}

const MovimientoDetalle = ({ mov, showDivider, theme }: IMovimientoDetalle) => {
  // const theme = useTheme();
  const { eliminarMovimiento } = useProductContext();

  return (
    <>
      {showDivider && <Divider horizontalInset />}
      <View
        style={[
          styles.card,
          { backgroundColor: theme?.colors.elevation.level1 },
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
            <Text>ids: {mov.id}</Text>
            <View />
          </View>
        </View>
        {/* <View style={styles.accion}>
          <IconButton
            centered
            mode="outlined"
            icon={'delete-outline'}
            size={24}
            onPress={() => eliminarMovimiento(mov.id)}
          />
        </View> */}

        {/* <View style={styles.opciones} /> */}
      </View>
    </>
  );
};

export default MovimientoDetalle;

const styles = StyleSheet.create({
  card: {
    height: 100,
    padding: 5,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // borderWidth: 1,
    // borderColor: 'blue',
    // marginHorizontal: 0,
  },
  left: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  accion: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
  // card: {
  //   height: 88,
  //   padding: 5,
  //   display: 'flex',
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  // },
  // left: {
  //   display: 'flex',
  //   flexDirection: 'row',
  //   width: '66%',
  // },
  // conta: {
  //   width: '50%',
  // },
  // opciones: {
  //   width: '25%',
  //   display: 'flex',
  //   flexDirection: 'row',
  // },

  // buttonLeft: {
  //   borderRadius: 4,
  //   marginHorizontal: 4,
  //   width: 40,
  //   height: 40,
  // },
});
