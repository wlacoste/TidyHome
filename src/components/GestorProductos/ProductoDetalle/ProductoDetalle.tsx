import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProductoList } from '../../../models/routeTypes';
import {
  Button,
  Dialog,
  Icon,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';
import MovimientoDetalle, { IMovimientoDetalle } from './MovimientoDetalle';
import { useProductContext } from '../../../context/productContext';
import { rgbToHex } from '../../../utils/rgbToHex';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MovimientoProducto, Producto } from '../../../models/productos';
import MenuComponent from './AccionesProducto';
import DataTableComponent from '../../DataTable';
import { useFab } from '../../../context/fabContext';
import { useFocusEffect } from '@react-navigation/native';
import EditarProducto from '../ProductForm/EditarProducto';
import GraficoEvolutivo from './GraficoEvolutivo';
import { useMovimiento } from './useMovimiento';
// import GraficoEvolutivo from './GraficoEvolutivo';

type Props = NativeStackScreenProps<ProductoList, 'ProductoDetalle'>;

const MetricDisplay = ({ label, value }) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',

        overflow: 'visible',
      }}>
      <Text style={{ fontSize: 15, marginBottom: 10 }}>{label}: </Text>
      <Text style={{ fontSize: 16, marginBottom: 10, fontWeight: '800' }}>
        {value}
      </Text>
    </View>
  );
};
const ProductoDetalle: React.FC<Props> = ({ route }) => {
  const { productoId } = route.params;
  const theme = useTheme();
  const { productos, eliminarProducto } = useProductContext();
  const navigation = useNavigation();
  const [producto, setProducto] = useState<Producto | null>(null);
  const { showFab, hideFab } = useFab();
  const [backButtonPressed, setBackButtonPressed] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleDelete, setVisibleDelete] = React.useState(false);
  const { valoresGrafico, metricas, ultimaCompra } = useMovimiento(
    producto?.detalle,
  );
  const showDialog = () => setVisibleDelete(true);

  const hideDialog = () => setVisibleDelete(false);

  const goBack = () => {
    setBackButtonPressed(() => true);
    navigation.goBack();
  };

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        hideFab();
      }, 150);

      return () => {
        clearTimeout(timer);
        showFab();
        setBackButtonPressed(prev => {
          if (!prev) {
            navigation.goBack();
          }
          return false;
        });
      };
    }, [backButtonPressed]),
  );

  useEffect(() => {
    const foundProducto = productos.find(prod => prod.id === productoId);
    if (!foundProducto) {
      navigation.goBack();
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      setProducto({
        ...foundProducto,
      });
    }
  }, [productoId, productos, navigation]);

  if (!producto) {
    return null;
  }
  return (
    <>
      <ScrollView>
        <Appbar.Header style={styles.header}>
          <Appbar.Action icon="chevron-left" onPress={goBack} />
          <Appbar.Content title="Detalles" subtitle={'Subtitle'} />
          {/* <Appbar.Action icon={'dots-vertical'} onPress={() => {}} /> */}
          <MenuComponent
            producto={producto}
            setOpenModal={setVisibleModal}
            setOpenDelete={showDialog}
          />
        </Appbar.Header>
        <View style={styles.tituloContainer}>
          <Icon
            source={producto.categoria.icon}
            color={theme.colors.primary}
            size={30}
          />
          <Text style={styles.titulo}>{producto.nombre}</Text>
        </View>
        <View style={{ paddingHorizontal: 10 }}>
          <Text style={{ paddingLeft: 10 }}>Detalles:</Text>
          <View style={styles.detalles}>
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                gap: 10,
              }}>
              <MetricDisplay
                label={'Cantidad actual'}
                value={metricas.cantidadActual}
              />
              <MetricDisplay
                label={'Variación semana'}
                value={metricas.avgWeeklyChange.toFixed(2)}
              />
            </View>

            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                gap: 10,
              }}>
              <MetricDisplay
                label={'Variación diaria'}
                value={metricas.avgDailyChange.toFixed(2)}
              />
              <MetricDisplay
                label={'Última compra'}
                value={ultimaCompra === 0 ? 'Hoy' : `${ultimaCompra} días`}
              />
            </View>
            <View
              style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
              <MetricDisplay
                label={'Estimado duracíon'}
                value={
                  metricas.daysUntilEmpty === Infinity
                    ? 'N/A (aumentando)'
                    : metricas.daysUntilEmpty
                }
              />
            </View>
          </View>
        </View>
        <View>
          <Text style={{ paddingLeft: 10 }}>Evolucion:</Text>
          <View style={styles.metrica}>
            <GraficoEvolutivo movimientos={valoresGrafico} />
          </View>
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
        <EditarProducto
          visible={visibleModal}
          setVisible={setVisibleModal}
          producto={producto}
        />
        <Portal>
          <Dialog visible={visibleDelete} onDismiss={hideDialog}>
            <Dialog.Title>Eliminar {producto.nombre}?</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                Se eliminara el producto y sus movimientos.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => eliminarProducto(productoId)}>
                Eliminar
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </>
  );
};

export default ProductoDetalle;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  header: {
    height: 60,
    elevation: 10,
  },
  detalles: {
    width: width - 20,
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    // width: '100%',
    height: 110,
    borderWidth: 1,
    borderColor: rgbToHex('60,60,60'),
    margin: 10,

    borderRadius: 5,
    alignSelf: 'center',
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
