import { View } from 'react-native';
import React from 'react';
import { LineChart } from 'react-native-gifted-charts';
import { useTheme } from 'react-native-paper';

const GraficoEvolutivo = ({ movimientos }) => {
  const theme = useTheme();

  return (
    <View>
      <LineChart
        areaChart
        data={movimientos}
        startFillColor="rgb(46, 217, 255)"
        startOpacity={0.8}
        endFillColor="rgb(203, 241, 250)"
        endOpacity={0.3}
        height={250}
        scrollToEnd
        endSpacing={-20}
        adjustToWidth
        spacing={60}
        noOfSections={5}
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
