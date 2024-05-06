import { Text, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useCategories } from '../../hooks/useCategories';
import { Button, Card } from 'react-native-paper';
import { PaperSelect } from 'react-native-paper-select';
import {
  ListItem,
  SelectedItem,
} from 'react-native-paper-select/lib/typescript/interface/paperSelect.interface';
import { ICategoria } from '..';

interface IProductoForm {
  nombre: string;
  cantidad: string | number;
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

  const [product, setProduct] = useState<IProductoForm>({
    nombre: '',
    cantidad: '',
    precio: '',
    isUnitario: false,
    categoria: '',
    fechaVencimiento: '',
    isVence: false,
    fechaCreacion: dayjs().format('DD/MM/YYYY'),
  });
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: value,
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
    <Card>
      <Card.Content>
        <Text>ProductForm</Text>
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

const styles = StyleSheet.create({});
