import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Button, Card, Switch, TextInput } from 'react-native-paper';
import Text from '../../Text';
import Collapsible from 'react-native-collapsible';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useForm, Controller } from 'react-hook-form';
import { useProductContext } from '../../../context/productContext';
import { IProductForm, IProductoForm } from '../../../models/productos';
import { mapProductoToForm } from '../../../utils/transformToProducto';

const PrimerMovimiento = ({ onClose, producto }: IProductForm) => {
  const { primerMovimiento } = useProductContext();
  const [openDate, setOpenDate] = useState(false);

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

    primerMovimiento({ ...data, id: producto?.id });

    onClose?.();
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <Text style={styles.titulo}>Nuevo movimiento {producto.nombre}</Text>
        <Text style={styles.titulo}>Categoria: {producto.categoria.name}</Text>

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

export default PrimerMovimiento;

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
