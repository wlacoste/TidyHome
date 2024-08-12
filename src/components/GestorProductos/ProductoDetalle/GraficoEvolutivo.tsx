import { View, Text } from 'react-native';
import React from 'react';
import { MovimientoProducto } from '../../../models/productos';
import { LineChart } from 'react-native-gifted-charts';
import { useTheme } from 'react-native-paper';

const mapMovimientos = (movimientos: MovimientoProducto[]) => {
  // const mov = movimientos.sort((a, b) => a.id - b.id);
  const mov = [...movimientos].sort((a, b) => a.id - b.id);
  let total = 0;
  return mov.map(item => {
    total = item.isCompra ? total + item.cantidad : total - item.cantidad;
    return { value: total, label: 'x' };
  });
};

const GraficoEvolutivo = ({ movimientos }) => {
  const theme = useTheme();
  const data = mapMovimientos(movimientos);
  return (
    <View>
      <LineChart
        areaChart
        data={data}
        startFillColor="rgb(46, 217, 255)"
        startOpacity={0.8}
        endFillColor="rgb(203, 241, 250)"
        endOpacity={0.3}
        height={250}
        scrollToEnd
        endSpacing={-20}
        adjustToWidth
        // textColor1="red"
        // color1="red"
        // dataPointsColor1="red"
        xAxisIndicesColor={'teal'}
        isAnimated
        animationDuration={500}
        yAxisTextStyle={{ color: theme.colors.onSurface }}
        xAxisLabelTextStyle={{ color: theme.colors.onSurface }}
        // xAxisTextStyle={{ color: theme.colors.onSurface }}
        // adjustToWidth
      />
      {/* {data.map(dato => (
        <Text>{dato.value}</Text>
      ))} */}
    </View>
  );
};

export default GraficoEvolutivo;
