import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Make sure to install this package
import {
  Categoria,
  DefaultCategories,
  IProductoFormSecond,
} from '../../models/productos';
import { useCategories } from '../../context/categoryContext';
import {
  Button,
  IconButton,
  Modal,
  Portal,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import { Control, Controller, FieldError, useWatch } from 'react-hook-form';

// interface CategorySelectorProps {
//   categories: Categoria[];
//   onSelect: (category: Categoria) => void;
// }
interface CategorySelectorProps {
  categories: Categoria[];
  control: Control<IProductoFormSecond>;
  name: 'categoria';
  error?: FieldError;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  control,
  name,
  error,
}) => {
  const [visible, setVisible] = useState(false);

  const selectedCategory = useWatch({
    control,
    name: 'categoria',
  });
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  // const handleSelectCategory = (category: Categoria) => {
  //   setSelectedCategory(category);
  //   // onSelect(category);
  //   hideModal();
  // };
  const theme = useTheme();

  useEffect(() => {
    console.log(selectedCategory);
    console.log('errors', error);
  }, [error]);

  const renderItem = useCallback(
    ({ item: category, onChange, value }) => (
      // console.log('value', value)
      <TouchableRipple
        key={category.id}
        style={styles.categoryItem}
        onPress={() => {
          onChange(category);
          hideModal();
        }}>
        <View style={styles.iconContainer}>
          <IconButton
            icon={category.icon}
            iconColor={
              selectedCategory?.id !== category.id
                ? theme.colors.onSurface
                : theme.colors.inverseSurface
            }
            style={{
              backgroundColor:
                selectedCategory?.id !== category.id
                  ? theme.colors.surfaceVariant
                  : theme.colors.inversePrimary,
            }}
          />
          <Text
            style={styles.categoryName}
            numberOfLines={1}
            ellipsizeMode="tail">
            {category.name}
          </Text>
        </View>
      </TouchableRipple>
    ),
    [theme.colors, selectedCategory],
  );

  return (
    <View>
      <Button
        mode="outlined"
        onPress={showModal}
        icon={selectedCategory?.icon}
        // style={styles.boton}
        style={[styles.boton, error ? { borderColor: 'red' } : null]}>
        {selectedCategory ? selectedCategory.name : 'Seleccionar Categoría'}
      </Button>
      {error && <Text style={{ color: 'red' }}>{error.message}</Text>}

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.background },
          ]}>
          <Text style={styles.modalTitle}>Seleccionar una categoría</Text>
          <Controller<IProductoFormSecond>
            control={control}
            name={name}
            defaultValue={undefined}
            rules={{
              required: 'Category is required',
              validate: value => value !== undefined,
            }}
            render={({ field: { onChange, value } }) => (
              <FlatList
                data={categories}
                renderItem={({ item }) => renderItem({ item, onChange, value })}
                keyExtractor={item => item.id.toString()}
                numColumns={4}
                contentContainerStyle={styles.container}
              />
            )}
          />
          <IconButton
            icon="close"
            size={24}
            onPress={hideModal}
            style={styles.closeButton}
          />
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    paddingVertical: 10,
  },
  modalContainer: {
    padding: 10,
    margin: 20,
    borderRadius: 8,
    maxHeight: 600,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalTitle: {
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  categoryItem: {
    width: '23%',
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginHorizontal: '1%',
  },
  categoryName: {
    fontSize: 12,
    lineHeight: 14,
    textAlign: 'center',
    letterSpacing: 0.7,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
  boton: {
    borderRadius: 3,
  },
});

export default CategorySelector;
