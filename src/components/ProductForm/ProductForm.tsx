import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
// import { useCategories } from '../../hooks/useCategories';
import { Button, Card, Switch, TextInput } from 'react-native-paper';
import { PaperSelect } from 'react-native-paper-select';
import { ListItem } from 'react-native-paper-select/lib/typescript/interface/paperSelect.interface';
import Text from '../Text';
import Collapsible from 'react-native-collapsible';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useForm, Controller, FieldError } from 'react-hook-form';
import { useProductContext } from '../../context/productContext';
import { IProductForm, IProductoForm } from '../../models/productos';
import { Categoria } from '../../models/categorias';
import { getListItem } from '../../utils/getListItems';
import { mapProductoToForm } from '../../utils/transformToProducto';
import { useCategories } from '../../context/categoryContext';
import CategorySelector from '../CategorySelector/CategorySelector';

const DismissKeyboardView = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={{ flex: 1 }}>{children}</View>
  </TouchableWithoutFeedback>
);

const ProductForm = ({ onClose, tipo, producto }: IProductForm) => {
  // const { categorias, loading: categoriasLoading } = useCategories();
  const {
    categories: categorias,
    loading,
    refreshCategories,
  } = useCategories();
  const { agregarProducto, primerMovimiento } = useProductContext();
  const [itemsCategorias, setItemsCategorias] = useState<ListItem[]>([]);
  const [openDate, setOpenDate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Categoria | null>(
    null,
  );
  // const { categories, loading } = useCategories();

  const handleCategorySelect = (category: Categoria) => {
    // Handle the selected category (e.g., update form state)
    console.log('Selected category:', category);
  };

  const {
    control,
    resetField,
    formState: { errors },
    handleSubmit,
  } = useForm<IProductoForm>({
    mode: 'onChange',
    defaultValues: mapProductoToForm(producto),
  });

  const submit = data => {
    console.log('submit data', data);
    if (tipo === 'nuevo') {
      agregarProducto(data);
    } else {
      primerMovimiento({ ...data, id: producto?.id });
    }
    onClose?.();
  };

  useEffect(() => {
    if (categorias) {
      setItemsCategorias(
        categorias.map(categoria => ({
          _id: categoria.id.toString(),
          value: categoria.name,
        })),
      );
    }
  }, [categorias]);

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <Text style={styles.titulo}>
          {tipo === 'nuevo' ? 'Nuevo producto' : 'Nuevo movimiento'}
        </Text>
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

        <Controller
          control={control}
          defaultValue=""
          name="cantidad"
          rules={{
            required: true,
            pattern: {
              value: /^[1-9][0-9]*$/,
              message: 'Only numbers are allowed and must be greater than zero',
            },
            validate: value => {
              const numberValue = Number(value);
              return numberValue >= 1 || 'The value must be at least 1';
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={'Cantidad'}
              onChangeText={onChange}
              value={value}
              onBlur={onBlur}
              error={errors.cantidad && true}
              keyboardType={'numeric'}
            />
          )}
        />
        <Controller
          control={control}
          defaultValue=""
          name="precio"
          rules={{
            required: false,
            validate: value => {
              if (value === '') {
                return true;
              }

              const numberValue = Number(value);
              return numberValue >= 1 || 'The value must be at least 1';
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              keyboardType={'numeric'}
              label={'Precio'}
              value={value}
              onChangeText={onChange}
              placeholder="0.00"
              onBlur={onBlur}
              left={<TextInput.Affix text="$" />}
              error={errors.precio && true}
            />
          )}
        />

        <View style={styles.viewUnitario}>
          <Text style={styles.textoUnitario}> Es precio por unidad?</Text>

          <Controller
            control={control}
            defaultValue={false}
            name="isUnitario"
            rules={{
              required: false,
              validate: () => {
                return true;
              },
            }}
            render={({ field: { onChange, value } }) => (
              <Switch value={value} onValueChange={onChange} />
            )}
          />
        </View>
        <Controller<IProductoForm>
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
              categories={categorias}
              value={value as Categoria | undefined}
              onChange={onChange}
              error={errors.categoria as FieldError | undefined}
            />
          )}
        />

        {/* <Controller
          control={control}
          // defaultValue=
          name="categoria"
          rules={{
            required: true,
            validate: () => {
              return true;
            },
          }}
          render={({ field: { onChange, value } }) => (
            <PaperSelect
              label={'Categorias'}
              arrayList={itemsCategorias}
              selectedArrayList={[]}
              multiEnable={false}
              value={
                itemsCategorias.find(item => item._id === value)
                  ? itemsCategorias.find(item => item._id === value)?.value + ''
                  : ''
              }
              onSelection={(value: any) => {
                onChange(value.selectedList[0]._id);
              }}
            />
          )}
        /> */}
        <View style={styles.viewUnitario}>
          <Text style={styles.textoUnitario}>Posee fecha de vencimiento?</Text>

          <Controller
            control={control}
            defaultValue={false}
            name="isVence"
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
                  setOpenDate(e);
                  if (!e) {
                    resetField('fechaVencimiento');
                  }
                }}
              />
            )}
          />
        </View>
        <Collapsible collapsed={!openDate}>
          <SafeAreaView>
            <Controller
              control={control}
              defaultValue={dayjs().add(2, 'week').toDate()}
              name="fechaVencimiento"
              rules={{
                required: false,
                validate: () => {
                  return true;
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  onPressIn={() => {
                    DateTimePickerAndroid.open({
                      value: value ? value : dayjs().add(2, 'week').toDate(),
                      onChange: e =>
                        onChange(new Date(e.nativeEvent.timestamp)),
                      mode: 'date',
                      minimumDate: dayjs().toDate(),
                    });
                  }}
                  value={value?.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                  onBlur={onBlur}
                  placeholder="DD/MM/YYYY"
                  showSoftInputOnFocus={false}
                />
              )}
            />
          </SafeAreaView>
        </Collapsible>
        <Button
          mode="contained"
          onPress={handleSubmit(submit)}
          style={styles.boton}>
          Agregar
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
