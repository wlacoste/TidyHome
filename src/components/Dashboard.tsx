import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Card, Text, useTheme } from 'react-native-paper';
import { useProductContext } from '../context/productContext';
import { Producto } from '../models/productos';
import { Categoria } from '../models/categorias';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import CatFallback from './CatFallback';
import { ScrollView } from 'react-native-gesture-handler';

interface CategoryCount {
  category: Categoria | null;
  value: number;
  label: string;
  color?: string;
  frontColor?: string;
  labelTextStyle?: { color: string };
}

function countCategories(products: Producto[]): CategoryCount[] {
  const categoryMap = new Map<number, CategoryCount>();

  products.forEach(product => {
    const categoryId = product.categoria.id;
    if (categoryMap.has(categoryId)) {
      categoryMap.get(categoryId)!.value++;
    } else {
      categoryMap.set(categoryId, {
        category: product.categoria,
        value: 1,
        label: product.categoria.name,
      });
    }
  });

  let categoryCounts = Array.from(categoryMap.values()).sort(
    (a, b) => b.value - a.value,
  );
  let topCategories = categoryCounts.slice(0, 5).map((cat, index) => ({
    ...cat,
    color: colors[index],
    frontColor: colors[index],
  }));
  let othersValue = categoryCounts
    .slice(5)
    .reduce((sum, cat) => sum + cat.value, 0);

  if (categoryCounts.length > 5) {
    topCategories.push({
      category: null,
      value: othersValue,
      label: 'Otros',
      color: '#9a031e',
      frontColor: '#9a031e',
    });
  }

  return topCategories;
}

export const colors = [
  '#8ECAE6',
  '#219EBC',
  '#023047',
  '#FFB703',
  '#FB8500',
  '#0d3b66',
  '#faf0ca',
  '#f4d35e',
  '#ee964b',
  '#f95738',
  '#370617',
  '#6a040f',
  '#9d0208',
  '#d00000',
  '#dc2f02',
  '#e85d04',
  '#f48c06',
  '#faa307',
  '#ffba08',
  '#90e0ef',
  '#48cae4',
  '#00b4d8',
  '#0096c7',
  '#0077b6',
  '#023e8a',
  '#1e6091',
  '#168aad',
  '#34a0a4',
  '#52b69a',
  '#76c893',
  '#99d98c',
  '#b5e48c',
  '#d9ed92',
  '#1b4332',
  '#40916c',
  '#2d6a4f',
  '#52b788',
  '#74c69d',
  '#95d5b2',
  '#b7e4c7',
  '#735d78',
  '#b392ac',
  '#d1b3c4',
  '#e8c2ca',
  '#f7d1cd',
  '#9d4edd',
  '#7b2cbf',
  '#5a189a',
  '#3c096c',
  '#240046',
  '#735d78',
];

const renderDot = color => {
  return (
    <View
      style={{
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: color,
        marginRight: 10,
      }}
    />
  );
};

const countMovimientos = (productos: Producto[]) => {
  const resultado: CategoryCount[] = productos.map(producto => ({
    category: null,
    label: producto.nombre,
    value: producto.detalle.length,
    color: undefined,
    frontColor: undefined,
  }));
  return resultado;
};

const Dashboard = () => {
  const { productos, loading } = useProductContext();
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);
  const [movimientoCount, setMovimientoCount] = useState<CategoryCount[]>([]);
  const theme = useTheme();
  useEffect(() => {
    if (productos.length) {
      const counts = countCategories(productos);
      const conColor = counts.map((count, index) => ({
        ...count,
        labelTextStyle: { color: theme.colors.onSurface },
        frontColor: colors[index % colors.length],
      }));
      setCategoryCounts(conColor);

      const movimientos = countMovimientos(productos);
      const movimientosConColor = movimientos.map((count, index) => ({
        ...count,
        labelTextStyle: { color: theme.colors.onSurface },
        frontColor: colors[(index + 5) % colors.length],
      }));
      setMovimientoCount(movimientosConColor);
    }
  }, [productos]);
  useEffect(() => {
    if (categoryCounts.length) {
      const conColor = categoryCounts.map(count => ({
        ...count,
        labelTextStyle: { color: theme.colors.onSurface },
      }));
      setCategoryCounts(conColor);
    }
  }, [theme]);

  if (productos.length === 0) {
    return (
      <CatFallback
        titulo={'Aquí no hay estadísticas.'}
        subtitulo={'Añade productos y con el tiempo verás su evolución.'}
        numeroImagen={1}
      />
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.chartContainer}>
        <Text variant="titleMedium" style={{ paddingLeft: 20, marginTop: 10 }}>
          Items por categoria:
        </Text>
        <View style={{ alignSelf: 'center', flex: 1, marginTop: 10 }}>
          <PieChart
            donut
            textColor="black"
            radius={90}
            innerRadius={60}
            innerCircleColor={theme.colors.elevation.level2}
            textSize={20}
            showTextBackground
            textBackgroundRadius={20}
            data={categoryCounts}
            focusOnPress
            isAnimated
            animationDuration={500}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 20,
            marginTop: 20,
            flexWrap: 'wrap',
            width: '90%',
            marginHorizontal: 25,
          }}>
          {categoryCounts.map(categoria => {
            return (
              <View
                key={`${categoria.label}-${categoria.category?.id}`}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: 120,
                  //   marginRight: 20,
                }}>
                {renderDot(categoria.color)}
                <Text>{categoria.label}</Text>
              </View>
            );
          })}
        </View>
      </Card>

      <Card style={styles.chartContainer1}>
        <Text variant="titleMedium" style={{ paddingLeft: 20, marginTop: 10 }}>
          Movimientos por producto:
        </Text>
        <ScrollView
          horizontal
          style={{
            alignSelf: 'flex-start',
            flex: 1,
            marginTop: 10,
            // borderWidth: 1,
          }}>
          <BarChart
            // showFractionalValue
            showYAxisIndices
            yAxisTextStyle={{ color: theme.colors.onSurface }}
            noOfSections={4}
            // maxValue={400}
            data={movimientoCount}
            isAnimated
            animationDuration={500}
            spacing={20}
            barWidth={40}
            xAxisLength={310}
            dashWidth={10}
          />
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 20,
            marginTop: 20,
            flexWrap: 'wrap',
            width: '90%',
            marginHorizontal: 25,
          }}
        />
      </Card>
      <Card style={styles.chartContainer1}>
        <Text variant="titleMedium" style={{ paddingLeft: 20, marginTop: 10 }}>
          Productos por categoria:
        </Text>
        <ScrollView
          horizontal
          style={{
            alignSelf: 'flex-start',
            flex: 1,
            marginTop: 10,
            // borderWidth: 1,
          }}>
          <BarChart
            // showFractionalValue
            showYAxisIndices
            yAxisTextStyle={{ color: theme.colors.onSurface }}
            noOfSections={4}
            // maxValue={400}
            data={categoryCounts}
            isAnimated
            animationDuration={500}
            spacing={20}
            barWidth={40}
            xAxisLength={310}
            dashWidth={10}
          />
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 20,
            marginTop: 20,
            flexWrap: 'wrap',
            width: '90%',
            marginHorizontal: 25,
          }}
        />
      </Card>
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  chartContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
    alignContent: 'center',
    height: 330,
    paddingTop: 5,
    alignItems: 'center',
  },
  chartContainer1: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
    alignContent: 'center',
    height: 330,
    paddingTop: 5,
    alignItems: 'flex-start',
  },
});
