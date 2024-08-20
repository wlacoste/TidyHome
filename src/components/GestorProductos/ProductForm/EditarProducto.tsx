import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import {
  Button,
  Card,
  Divider,
  Modal,
  Portal,
  Switch,
  TextInput,
  useTheme,
} from 'react-native-paper';
import Text from '../../Text';

import { useForm, Controller, FieldError } from 'react-hook-form';
import { useProductContext } from '../../../context/productContext';
import { Producto } from '../../../models/productos';
import { Categoria } from '../../../models/categorias';
import { useCategories } from '../../../context/categoryContext';
import CategorySelector from '../../CategorySelector/CategorySelector';
import { Dropdown } from 'react-native-element-dropdown';

export interface IEditarProducto {
  onClose?: () => void;
  producto: Producto;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<any>>;
}

const data = [
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10', value: '10' },
];
const EditarProducto = ({
  onClose,
  producto,
  visible,
  setVisible,
}: IEditarProducto) => {
  const { loading, categories } = useCategories();
  const { actualizarProducto } = useProductContext();

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<Omit<Producto, 'detalle'>>({
    mode: 'onChange',
    defaultValues: {
      ...producto,
    },
  });
  const theme = useTheme();

  const submit = data => {
    const producto = data as Producto;
    actualizarProducto(data as Producto);
    setVisible(false);
    onClose?.();
  };
  const [isFocus, setIsFocus] = useState(false);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => {
          setVisible(false);
          reset();
        }}>
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
                  categories={categories}
                  value={value as Categoria | undefined}
                  onChange={onChange}
                  error={errors.categoria as FieldError | undefined}
                />
              )}
            />
            <View style={styles.viewUnitario}>
              <Text style={styles.textoUnitario}>
                Agregar a lista de compra?
              </Text>

              <Controller
                control={control}
                defaultValue={producto.agregarListaCompra}
                name="agregarListaCompra"
                rules={{
                  required: false,
                  validate: () => {
                    return true;
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <Switch
                    value={value}
                    onValueChange={e => {
                      onChange(e);
                    }}
                  />
                )}
              />
            </View>
            <Divider />

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 17,
                  width: '60%',
                  textAlignVertical: 'center',
                }}>
                Cantidad recordatorio compra:
              </Text>

              <Controller<Omit<Producto, 'detalle'>>
                control={control}
                name={'cantidadAdvertencia'}
                disabled={loading}
                defaultValue={producto.cantidadAdvertencia}
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    style={[
                      style.container,
                      { backgroundColor: theme.colors.surfaceVariant },
                      {
                        borderColor: theme.colors.outline,
                        borderBottomWidth: 1,
                      },
                      isFocus && {
                        borderColor: theme.colors.primary,
                        borderBottomWidth: 1.5,
                      },
                    ]}
                    placeholderStyle={[
                      style.placeholderStyle,
                      { color: theme.colors.onSurface },
                    ]}
                    selectedTextStyle={[
                      style.selectedTextStyle,
                      { color: theme.colors.onSurface, textAlign: 'center' },
                    ]}
                    inputSearchStyle={style.inputSearchStyle}
                    iconStyle={style.iconStyle}
                    containerStyle={[
                      {
                        maxHeight: 200,
                      },
                    ]}
                    itemContainerStyle={[
                      {
                        paddingHorizontal: 'auto',
                        backgroundColor: theme.colors.surface,
                      },
                    ]}
                    itemTextStyle={[
                      { color: theme.colors.onSurface, textAlign: 'center' },
                    ]}
                    activeColor={theme.colors.secondary}
                    data={data}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? 'Select item' : '...'}
                    searchPlaceholder="Buscar..."
                    value={producto.cantidadAdvertencia.toString()}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                      onChange(Number(item.value));
                      setIsFocus(false);
                    }}
                  />
                )}
              />
            </View>
            <Divider />

            <View style={styles.viewUnitario}>
              <Text style={styles.textoUnitario}>Seguir estadisticas?</Text>

              <Controller
                control={control}
                defaultValue={producto.seguirEstadistica}
                name="seguirEstadistica"
                rules={{
                  required: false,
                  validate: () => {
                    return true;
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <Switch
                    value={value}
                    onValueChange={e => {
                      onChange(e);
                    }}
                  />
                )}
              />
            </View>
            <Divider />

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

const style = StyleSheet.create({
  container: {
    width: '40%',
    padding: 16,
    borderTopEndRadius: 4,
    borderTopStartRadius: 4,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 17,

    // color: 'red',
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

const styles = StyleSheet.create({
  card: {
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
