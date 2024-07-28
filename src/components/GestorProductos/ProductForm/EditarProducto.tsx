import { StyleSheet } from 'react-native';
import React from 'react';
import dayjs from 'dayjs';
import {
  Button,
  Card,
  Modal,
  Portal,
  Switch,
  TextInput,
} from 'react-native-paper';
import Text from '../../Text';

import { useForm, Controller, FieldError } from 'react-hook-form';
import { useProductContext } from '../../../context/productContext';
import { Producto } from '../../../models/productos';
import { Categoria } from '../../../models/categorias';
import { useCategories } from '../../../context/categoryContext';
import CategorySelector from '../../CategorySelector/CategorySelector';

export interface IEditarProducto {
  onClose?: () => void;
  producto: Producto;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<any>>;
}

const EditarProducto = ({
  onClose,
  producto,
  visible,
  setVisible,
}: IEditarProducto) => {
  const { loading } = useCategories();
  const { agregarProducto, primerMovimiento } = useProductContext();

  const {
    control,
    resetField,
    formState: { errors },
    handleSubmit,
  } = useForm<Omit<Producto, 'detalle'>>({
    mode: 'onChange',
    defaultValues: {
      ...producto,
    },
  });

  const submit = data => {
    console.log('submit data', data);

    onClose?.();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={() => setVisible(false)}>
        <Card style={styles.card}>
          <Card.Content style={styles.content}>
            <Text style={styles.titulo}>Edicion</Text>
            <Controller
              control={control}
              defaultValue=""
              name="nombre"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label={'Producto'}
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                  error={errors.nombre && true}
                  autoCapitalize="sentences"
                />
              )}
            />

            <Controller<Omit<Producto, 'detalle'>>
              control={control}
              name={'categoria'}
              disabled={loading}
              defaultValue={undefined}
              rules={{
                required: 'Category is required',
                validate: value => value !== undefined,
              }}
              render={({ field: { onChange, value } }) => (
                <CategorySelector
                  // categories={categorias}
                  value={value as Categoria | undefined}
                  onChange={onChange}
                  error={errors.categoria as FieldError | undefined}
                />
              )}
            />

            <Button
              mode="contained"
              onPress={handleSubmit(submit)}
              style={styles.boton}>
              Editar
            </Button>
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );
};

export default EditarProducto;

const styles = StyleSheet.create({
  card: {
    // position: 'absolute',
    // left: '-50%',
    // right: 100,
    // top: 0,
    // bottom: 0,
    margin: 10,
    width: '95%',
    borderRadius: 10,
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
  boton: {
    borderRadius: 20,
  },
});
