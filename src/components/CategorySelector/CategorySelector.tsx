import React, { useCallback, useContext, useState } from 'react';
import { View, StyleSheet, FlatList, Keyboard } from 'react-native';
import { Categoria } from '../../models/categorias';
import {
  Button,
  Icon,
  IconButton,
  Modal,
  Portal,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import { FieldError } from 'react-hook-form';
import { CategoryContext } from '../../context/categoryContext';

interface CategorySelectorProps {
  categories: Categoria[];

  error?: FieldError;
  value: Categoria | undefined;
  onChange: (value: Categoria) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
  error,
}) => {
  const { categories } = useContext(CategoryContext);

  const [visible, setVisible] = useState(false);
  const showModal = () => {
    setVisible(true);
  };
  const hideModal = () => setVisible(false);

  const theme = useTheme();

  const renderItem = useCallback(
    ({ item: category, onChange, value }) => (
      <TouchableRipple
        borderless
        key={category.id}
        style={styles.categoryItem}
        onPress={() => {
          onChange(category);
          hideModal();
        }}>
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.botonSelector,
              {
                backgroundColor:
                  value?.id !== category.id
                    ? theme.colors.surfaceVariant
                    : theme.colors.inversePrimary,
              },
            ]}>
            <Icon
              source={category.icon}
              color={
                value?.id !== category.id
                  ? theme.colors.onSurface
                  : theme.colors.inverseSurface
              }
              size={22}
            />
          </View>
          <Text
            style={styles.categoryName}
            numberOfLines={1}
            ellipsizeMode="tail">
            {category.name}
          </Text>
        </View>
      </TouchableRipple>
    ),
    [theme.colors, value],
  );

  return (
    <View>
      <Button
        focusable
        mode="outlined"
        onPress={() => {
          Keyboard.dismiss();
          showModal();
        }}
        icon={value?.icon}
        style={[
          styles.boton,
          error ? { borderColor: theme.colors.error } : null,
        ]}
        textColor={error ? theme.colors.error : theme.colors.primary}>
        {value ? value.name : 'Seleccionar Categoría'}
      </Button>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.background },
          ]}>
          <Text style={styles.modalTitle}>Seleccionar una categoría</Text>
          <FlatList
            data={categories}
            renderItem={({ item }) => renderItem({ item, onChange, value })}
            keyExtractor={item => item.id.toString()}
            numColumns={4}
            contentContainerStyle={styles.container}
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
  botonSelector: {
    borderRadius: 100,
    padding: 10,
    marginBottom: 2,
  },
  modalTitle: {
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  categoryItem: {
    width: '23%',
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
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
