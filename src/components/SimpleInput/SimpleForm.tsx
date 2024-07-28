import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Card, TextInput } from 'react-native-paper';
import Text from '../Text';
import { IAddData, IGetColeccion, useFireDB } from '../../hooks/useFireDB';
import auth from '@react-native-firebase/auth';
import 'react-native-get-random-values';
import { nanoid } from 'nanoid';
import { INuevoProducto } from '../GestorProductos/ProductForm/ProductFormModal';

const SimpleForm = ({ onClose }: INuevoProducto) => {
  const [product, setProduct] = useState<string | undefined>(undefined);
  const [products, setProducts] = useState<string[]>([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState({ getData: false });
  const { addData, getColeccion } = useFireDB();

  const [u, setUser] = useState();
  const [l, setL] = useState({});
  const [e, setE] = useState();

  useEffect(() => {
    const request: IGetColeccion = {
      setLoading: setL,
      setData: setUser,
      setError: setE,
      subColeccion: [
        { coleccion: 'Users', id: auth().currentUser?.uid },
        { coleccion: 'input' },
      ],
    };
    // getColeccion(request);
  }, []);

  useEffect(() => {
    console.log(u);
  }, [u]);

  useEffect(() => {
    console.log('prodoso', products);
  }, [products]);

  const handleChange = (e: string) => {
    setProduct(e);
  };

  const handleSubmit = () => {
    const id = nanoid(6);
    if (product) {
      if (!auth().currentUser) {
        return;
      }
      // setProducts(prevItems => [...prevItems, product]);
      const request: IAddData = {
        setLoading: setLoading,
        setData: setProducts,
        setError: setError,
        subColeccion: [
          { coleccion: 'Users', id: auth().currentUser?.uid },
          { coleccion: 'input' },
        ],
        data: { valor: product, nanoId: id },
      };
      addData(request);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <Text style={styles.titulo}>Nuevo Input</Text>
        <TextInput
          label={'Producto'}
          value={product}
          onChangeText={e => handleChange(e)}
          autoFocus
        />

        <Button
          mode="contained"
          onPress={() => {
            handleSubmit();
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
