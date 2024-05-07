import {
  Text,
  StyleSheet,
  View,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useCategories } from '../../hooks/useCategories';
import { Button, Card, Switch, TextInput, useTheme } from 'react-native-paper';
import { PaperSelect } from 'react-native-paper-select';
import {
  ListItem,
  SelectedItem,
} from 'react-native-paper-select/lib/typescript/interface/paperSelect.interface';
import { ICategoria } from '..';

interface IProductoForm {
  nombre: string;
  cantidad: string | undefined;
  precio: string | number;
  isUnitario: boolean;
  categoria: string;
  fechaVencimiento: string | Date;
  isVence: boolean;
  fechaCreacion: string | Date;
}

const getListItem = (categorias: ICategoria[]) => {
  const items: ListItem[] = categorias.map(categoria => ({
    _id: categoria.id.toString(),
    value: categoria.nombre,
  }));
  return items;
};

const ProductForm = () => {
  const { categorias, loading: categoriasLoading } = useCategories();
  const [itemsCategorias, setItemsCategorias] = useState<ListItem[]>([]);
  const theme = useTheme();

  const [product, setProduct] = useState<IProductoForm>({
    nombre: '',
    cantidad: undefined,
    precio: '',
    isUnitario: false,
    categoria: '',
    fechaVencimiento: '',
    isVence: false,
    fechaCreacion: dayjs().format('DD/MM/YYYY'),
  });
  const handleChange = (e: string | boolean, nombre: string) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      [nombre]: e,
    }));
  };
  const toggleVence = () => {
    // if(!product.isVence){
    //   setProduct({...product, fechaVencimiento:""})
    // }
    setProduct(prevProduct => ({
      ...prevProduct,
      isVence: !prevProduct.isVence,
      // fechaVencimiento: dayjs().add(2, "week"),
      //   fechaVencimiento: !prevProduct.isVence ? dayjs().add(2, 'week') : '',
    }));
  };
  const toggleUnitario = () => {
    setProduct(prevProduct => ({
      ...prevProduct,
      isUnitario: !prevProduct.isUnitario,
    }));
  };
  const setFecha = (e: any) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      fechaVencimiento: e,
    }));
  };
  useEffect(() => {
    if (categorias) {
      setItemsCategorias(getListItem(categorias));
    }
  }, [categorias]);

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <Text style={[styles.titulo, { color: theme.colors.onSurface }]}>
          Nuevo Producto
        </Text>
        <TextInput
          label={'Producto'}
          value={product.nombre}
          onChangeText={e => handleChange(e, 'nombre')}
        />
        <TextInput
          keyboardType={'numeric'}
          label={'Cantidad'}
          value={product.cantidad}
          onChangeText={e => handleChange(e, 'cantidad')}
        />
        <View style={styles.viewUnitario}>
          <Text style={styles.textoUnitario}> Es precio unitario?</Text>
          <Switch
            value={product.isUnitario}
            onValueChange={e => handleChange(e, 'isUnitario')}
          />
        </View>
        <PaperSelect
          label={'Categorias'}
          arrayList={itemsCategorias}
          selectedArrayList={[]}
          multiEnable={false}
          value={product.categoria}
          onSelection={(value: any) => {
            setProduct(prevProduct => ({
              ...prevProduct,
              categoria: value.text,
            }));
          }}
        />
        <Button mode="contained" onPress={() => console.log(product)}>
          Console
        </Button>
      </Card.Content>
    </Card>
  );
};

export default ProductForm;

const styles = StyleSheet.create({
  card: {
    margin: 10,
    width: '95%',
  },
  titulo: {
    fontSize: 20,
    height: 35,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    display: 'flex',
    gap: 10,
  },
  viewUnitario: {
    height: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textoUnitario: {
    fontSize: 18,
    fontWeight: '600',
  },
});
