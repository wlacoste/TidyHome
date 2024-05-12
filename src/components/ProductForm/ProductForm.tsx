import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useCategories } from '../../hooks/useCategories';
import { Button, Card, Switch, TextInput } from 'react-native-paper';
import { PaperSelect } from 'react-native-paper-select';
import { ListItem } from 'react-native-paper-select/lib/typescript/interface/paperSelect.interface';
import { ICategoria } from '../Categorias/Categorias';
import Text from '../Text';
import Collapsible from 'react-native-collapsible';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

interface IProductoForm {
  nombre: string;
  cantidad: string | undefined;
  precio: string | undefined;
  isUnitario: boolean;
  categoria: string;
  fechaVencimiento: Date | undefined;
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

  const [displayValue, setDisplayValue] = useState('');

  const [openDate, setOpenDate] = React.useState(false);

  const [product, setProduct] = useState<IProductoForm>({
    nombre: '',
    cantidad: undefined,
    precio: '',
    isUnitario: false,
    categoria: '',
    fechaVencimiento: undefined,
    isVence: false,
    fechaCreacion: dayjs().format('DD/MM/YYYY'),
  });

  const handleChange = (e: string | boolean, nombre: string) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      [nombre]: e,
    }));
  };
  const handleChangeDate = (e: boolean) => {
    setOpenDate(e);

    setProduct(prevProduct => ({
      ...prevProduct,
      fechaVencimiento: e ? dayjs().add(2, 'week').toDate() : undefined,
      isVence: e,
    }));
  };

  const handleInputChange = (text: string, nombre: string) => {
    const isPositiveInteger = (input: string): boolean => {
      const parsedValue = parseInt(input, 10);
      return !isNaN(parsedValue) && parsedValue > 0;
    };
    if (text === '' || isPositiveInteger(text)) {
      const valor = isPositiveInteger(text)
        ? parseInt(text, 10).toString()
        : '';

      handleChange(valor, nombre);
    }
  };

  const handleCurrencyInput = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const options = {
      useGrouping: true,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    };
    const formattedValue = Number(numericValue)
      .toLocaleString('en-US', options)
      .replace(/,/g, '.');

    handleChange(numericValue, 'precio');
    setDisplayValue(formattedValue);
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

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: product.fechaVencimiento
        ? product.fechaVencimiento
        : dayjs().add(2, 'week').toDate(),
      onChange: e => setFecha(new Date(e.nativeEvent.timestamp)),
      mode: 'date',
      minimumDate: dayjs().toDate(),
    });
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <Text style={styles.titulo}>Nuevo Producto</Text>
        <TextInput
          label={'Producto'}
          value={product.nombre}
          onChangeText={e => handleChange(e, 'nombre')}
        />
        <TextInput
          keyboardType={'numeric'}
          label={'Cantidad'}
          value={product.cantidad}
          onChangeText={e => handleInputChange(e, 'cantidad')}
        />
        <TextInput
          keyboardType={'numeric'}
          label={'Precio'}
          value={displayValue}
          onChangeText={handleCurrencyInput}
          placeholder="0.00"
          left={<TextInput.Affix text="$" />}
        />
        <View style={styles.viewUnitario}>
          <Text style={styles.textoUnitario}> Es precio por unidad?</Text>
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
        <View style={styles.viewUnitario}>
          <Text style={styles.textoUnitario}>Posee fecha de vencimiento?</Text>
          <Switch
            value={openDate}
            onValueChange={e => {
              handleChangeDate(e);
            }}
          />
        </View>
        <Collapsible collapsed={!openDate}>
          <SafeAreaView>
            <TextInput
              onPressIn={showDatePicker}
              value={product.fechaVencimiento?.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
              placeholder="DD/MM/YYYY"
              showSoftInputOnFocus={false}
            />
          </SafeAreaView>
        </Collapsible>
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
    fontFamily: 'Roboto',
  },
  content: {
    display: 'flex',
    gap: 10,
  },
  inputCurrency: {
    backgroundColor: 'red',
    width: '100%',
    height: 60,
    display: 'flex',
    verticalAlign: 'middle',
    paddingLeft: 20,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
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
