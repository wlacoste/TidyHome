import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import {
  Button,
  Icon,
  IconButton,
  List,
  Switch,
  useTheme,
} from 'react-native-paper';
import { useCategories } from '../context/categoryContext';
import { Categoria } from '../models/categorias';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';

const CategoryView = () => {
  const theme = useTheme();
  const { categories, updateCategories } = useCategories();

  const onReorderCategories = (newOrder: Categoria[]) => {
    const updatedCategories = newOrder.map((category, index) => ({
      ...category,
      ordenCategoria: index,
    }));
    console.log('nuevo Orden', updatedCategories);

    updateCategories(updatedCategories);
  };

  const updateCate = (categoria: Categoria) => {
    updateCategories(
      categories.map(item => (item.id !== categoria.id ? item : categoria)),
    );
  };

  const renderItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<Categoria>) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onLongPress={drag}
        disabled={isActive}
        style={[
          styles.itemContainer,
          {
            backgroundColor: isActive
              ? 'rgba(0,0,0,0.1)'
              : theme.colors.background,
          },
        ]}>
        <List.Item
          title={item.name}
          left={() => (
            <View style={styles.iconContainer}>
              <Switch
                value={item.isEnabled}
                onValueChange={() => {
                  updateCate({ ...item, isEnabled: !item.isEnabled });
                }}
                color={theme.colors.primary}
              />
              <View style={[styles.icon, { backgroundColor: item.color }]}>
                <IconButton
                  icon={item.icon}
                  size={24}
                  onPress={() => {}}
                  mode="outlined"
                  containerColor={item.color ? item.color : undefined}
                />
              </View>
            </View>
          )}
          right={() => (
            <View style={styles.rightContainer}>
              <Icon source="drag" size={24} color="gray" />
            </View>
          )}
        />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <Button
          style={styles.addButton}
          icon="pen-plus"
          mode="contained"
          onPress={() => console.log('Pressed')}>
          Agregar categoría
        </Button>
        <View>
          <DraggableFlatList
            data={categories}
            renderItem={renderItem}
            keyExtractor={item => `draggable-item-${item.id}`}
            onDragEnd={({ data }) => onReorderCategories(data)}
            style={{ marginBottom: 75 }}
          />
        </View>
      </View>
    </>
  );
};

export default CategoryView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tabText: {
    color: 'white',
  },
  activeTabText: {
    color: 'black',
  },
  itemContainer: {
    width: '100%',
    borderBottomWidth: 0.5,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    // padding: 16,
    alignItems: 'center',
    margin: 16,
    borderRadius: 8,
    // height: 20,
  },
  addButtonText: {
    fontWeight: 'bold',
  },
});
