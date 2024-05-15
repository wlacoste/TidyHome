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
import { IProductForm } from '../ProductForm/ProductForm';

interface ISimpleInput {
  nombre: string;
}

const SimpleForm = ({ onClose }: IProductForm) => {
  const [product, setProduct] = useState<ISimpleInput>({
    nombre: '',
  });

  const handleChange = (e: string | boolean, nombre: string) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      [nombre]: e,
    }));
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <Text style={styles.titulo}>Nuevo Input</Text>
        <TextInput
          label={'Producto'}
          value={product.nombre}
          onChangeText={e => handleChange(e, 'nombre')}
        />

        <Button
          mode="contained"
          onPress={() => {
            console.log(product);
            onClose?.();
          }}
          style={styles.boton}>
          Console
        </Button>
      </Card.Content>
    </Card>
  );
};

export default SimpleForm;

const styles = StyleSheet.create({
  card: {
    margin: 10,
    width: 200,
    borderRadius: 30,
    display: 'flex',
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
    width: '100%',
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
  boton: {
    borderRadius: 20,
  },
});
