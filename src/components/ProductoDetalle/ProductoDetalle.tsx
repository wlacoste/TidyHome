import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProductoList } from '../../models/routeTypes';
import { Icon, IconButton, Text, useTheme } from 'react-native-paper';
import { SwipeListView } from 'react-native-swipe-list-view';
import MovimientoDetalle, {
  IMovimientoDetalle,
} from '../ProductoBar/MovimientoDetalle';
import { useProductContext } from '../../context/productContext';
import { rgbToHex } from '../../utils/rgbToHex';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MovimientoProducto, Producto } from '../../models/productos';
import MenuComponent from './AccionesProducto';
import DataTableComponent from '../DataTable';

type Props = NativeStackScreenProps<ProductoList, 'ProductoDetalle'>;

const ProductoDetalle: React.FC<Props> = ({ route }) => {
  const { productoId } = route.params;
  const theme = useTheme();
  const { productos } = useProductContext();
  const navigation = useNavigation();
  const [producto, setProducto] = useState<Producto | null>(null);

  useEffect(() => {
    const foundProducto = productos.find(prod => prod.id === productoId);
    if (!foundProducto) {
      navigation.goBack();
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      setProducto(foundProducto);
    }
  }, [productoId, productos, navigation]);

  if (!producto) {
    return null;
  }
  return (
    <ScrollView>
      <Appbar.Header style={styles.header}>
        <Appbar.Action
          icon="chevron-left"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content title="Detalles" subtitle={'Subtitle'} />
        {/* <Appbar.Action icon={'dots-vertical'} onPress={() => {}} /> */}
        <MenuComponent id={producto.id} />
      </Appbar.Header>
      <View style={styles.tituloContainer}>
        <Icon
          source={producto.categoria.icon}
          color={theme.colors.primary}
          size={30}
        />
        <Text style={styles.titulo}>{producto.nombre}</Text>
      </View>
      <View>
        <Text>Detalles:</Text>
        <View style={styles.detalles} />
      </View>
      <View>
        <Text>Evolucion:</Text>
        <View style={styles.metrica} />
      </View>
      <View>
        <Text>Movimientos:</Text>

        <DataTableComponent<MovimientoProducto, IMovimientoDetalle>
          items={producto.detalle}
          renderItem={MovimientoDetalle}
          getItemProps={(item, index, array) => ({
            mov: item,
            showDivider: index !== array.length - 1,
            theme: theme,
          })}
        />
      </View>
      {/* <View>
        <Text>Movimientos:</Text>
        <SwipeListView
          keyExtractor={(item, index) => item.id.toString()}
          data={producto.detalle}
          renderItem={data => (
            <MovimientoDetalle mov={data.item} showDivider={data.index !== 0} />
          )}
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
      </View> */}
    </ScrollView>
  );
};

export default ProductoDetalle;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  header: {
    // borderWidth: 1,
    // borderColor: 'red',
    height: 60,
    elevation: 10,
  },
  detalles: {
    width: width - 20,
    height: 100,
    borderWidth: 1,
    borderColor: rgbToHex('60,60,60'),
    margin: 10,
    borderRadius: 5,
  },
  metrica: {
    width: width - 20,
    height: 300,
    borderWidth: 1,
    borderColor: rgbToHex('60,60,60'),
    margin: 10,
    borderRadius: 5,
  },
  tituloContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 15,
    paddingVertical: 7,
    gap: 5,
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  titulo: {
    fontSize: 30,
    // paddingLeft: 10,
    fontWeight: '800',
  },

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
    // maxHeight: 202,
    // flexDirection: 'column',
    // flexBasis: 1,
    // flexGrow: 1,
    // flex: 1,
    // overflow: 'scroll',
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
  containerSafe: {
    // flex: 1,
  },
});
