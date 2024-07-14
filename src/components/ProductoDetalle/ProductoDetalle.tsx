import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProductoList } from '../../models/routeTypes';
import { IconButton, useTheme } from 'react-native-paper';
import { SwipeListView } from 'react-native-swipe-list-view';
import MovimientoDetalle from '../ProductoBar/MovimientoDetalle';
import { useProductContext } from '../../context/productContext';

type Props = NativeStackScreenProps<ProductoList, 'ProductoDetalle'>;

const ProductoDetalle: React.FC<Props> = ({ route }) => {
  const { producto } = route.params;
  const theme = useTheme();
  const { eliminarMovimiento } = useProductContext();

  return (
    <View>
      <Text>ProductoDetalle</Text>
      <Text>{producto.nombre}</Text>
      <SwipeListView
        keyExtractor={(item, index) => item.id.toString()}
        data={producto.detalle}
        renderItem={data => <MovimientoDetalle mov={data.item} />}
        style={styles.contenedorDetalle}
        renderHiddenItem={(data, rowMap) => (
          <View style={[styles.hiddenContainer]}>
            <View
              style={[
                styles.xscroll,
                styles.leftScroll,
                {
                  backgroundColor: theme.colors.inverseSurface,
                },
              ]}>
              <IconButton
                icon="trash-can-outline"
                iconColor={theme.colors.onPrimary}
                size={35}
                onPress={() => {
                  eliminarMovimiento(data.item.id);
                }}
              />
            </View>
            <View
              style={[
                styles.xscroll,
                styles.rightScroll,
                {
                  backgroundColor: theme.colors.primary,
                },
              ]}>
              <IconButton
                icon="playlist-edit"
                iconColor={theme.colors.onPrimary}
                size={35}
                onPress={() => {}}
              />
            </View>
          </View>
        )}
        leftOpenValue={75}
        rightOpenValue={-75}
        scrollEnabled={true}
        disableScrollViewPanResponder={true}
        nestedScrollEnabled={true}
      />
    </View>
  );
};

export default ProductoDetalle;

const styles = StyleSheet.create({
  card: {
    margin: 5,
    // borderColor: 'red',
    // borderWidth: 1,
    // paddingBottom: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',

    // marginLeft: -15,
  },
  leftSectionContent: {
    // padding: 0,
    // marginTop: 0,
  },
  categoriaContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 3,
  },
  icon: {
    marginVertical: 0,
    paddingVertical: 0,
    marginRight: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  textCategoria: {
    fontSize: 12,
    lineHeight: 13,
  },
  rightSection: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: 132,
  },
  cantidad: {
    fontSize: 20,
    fontWeight: '700',
    textAlignVertical: 'center',
    width: 30,

    textAlign: 'center',

    height: 40,
    flex: 1,
  },
  buttonLeft: {
    padding: 0,
    margin: 0,
    // marginLeft: 8,
    width: 40,
    height: 40,
  },
  buttonRight: {
    padding: 0,
    margin: 0,
    width: 40,
    height: 40,
  },
  buttonChev: {
    padding: 0,
    marginLeft: 5,
    margin: 0,
    width: 40,
    height: 40,
  },

  buttonText: {
    lineHeight: 29,
    fontSize: 35,
  },
  buttonTextPlus: {
    lineHeight: 26,
    fontSize: 28,
  },
  hiddenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    flex: 1,
  },
  contenedorDetalle: {
    maxHeight: 360,
    overflow: 'scroll',
  },
  xscroll: {
    height: 86,
    justifyContent: 'center',
    width: '50%',
    marginTop: 1,
  },
  rightScroll: {
    alignItems: 'flex-end',
  },
  leftScroll: {
    alignItems: 'flex-start',
    paddingLeft: 5,
  },
});
