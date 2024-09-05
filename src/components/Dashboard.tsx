import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Card, Text, useTheme } from 'react-native-paper';
import { useProductContext } from '../context/productContext';
import { Producto } from '../models/productos';
import { Categoria } from '../models/categorias';
import { BarChart, PieChart } from 'react-native-gifted-charts';

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

const colors = ['#8ECAE6', '#219EBC', '#023047', '#FFB703', '#FB8500'];

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

const Dashboard = () => {
  const { productos, loading } = useProductContext();
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);
  const theme = useTheme();
  useEffect(() => {
    if (productos.length) {
      const counts = countCategories(productos);
      const conColor = counts.map(count => ({
        ...count,
        labelTextStyle: { color: theme.colors.onSurface },
      }));
      setCategoryCounts(conColor);
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

  return (
    <View style={styles.container}>
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
      <Card style={styles.chartContainer}>
        <Text variant="titleMedium" style={{ paddingLeft: 20, marginTop: 10 }}>
          Items por categoria:
        </Text>
        <View
          style={{
            alignSelf: 'center',
            flex: 1,
            marginTop: 10,
            marginHorizontal: 5,
            // paddingLeft: 0,
            // paddingRight: 10,
            // marginLeft: 10,
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
        </View>
        {/* <View
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
        </View> */}
      </Card>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  chartContainer: {
    marginTop: 20,
    alignContent: 'center',
    height: 330,

    paddingTop: 5,
    alignItems: 'center',
  },
});
