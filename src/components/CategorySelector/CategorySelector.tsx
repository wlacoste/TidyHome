import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Make sure to install this package
import { Categoria, DefaultCategories } from '../../models/productos';
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
import { ScrollView } from 'react-native-virtualized-view';
import { useModal } from '../../context/modalContext';

interface CategorySelectorProps {
  categories: Categoria[];
  onSelect: (category: Categoria) => void;
}
const numColumns = 4;
const screenWidth = Dimensions.get('window').width;
// const itemWidth = screenWidth / numColumns;

const CategorySelector: React.FC<CategorySelectorProps> = ({
  // categories,
  onSelect,
}) => {
  const categories = DefaultCategories;
  const [visible, setVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Categoria | null>(
    null,
  );

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleSelectCategory = (category: Categoria) => {
    setSelectedCategory(category);
    onSelect(category);
    hideModal();
  };
  const theme = useTheme();

  const renderItem = ({ item: category }) => (
    <TouchableRipple
      key={category.id}
      style={styles.categoryItem}
      onPress={() => handleSelectCategory(category)}>
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
  );

  return (
    <View>
      <Button mode="outlined" onPress={showModal} icon={selectedCategory?.icon}>
        {selectedCategory ? selectedCategory.name : 'Seleccionar Categoría'}
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
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
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
});

export default CategorySelector;
