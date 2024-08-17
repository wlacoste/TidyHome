import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import {
  Button,
  Card,
  Divider,
  Icon,
  IconButton,
  List,
  Modal,
  Portal,
  Switch,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import { useCategories } from '../context/categoryContext';
import { Categoria } from '../models/categorias';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { ScrollView } from 'react-native-gesture-handler';
import ColorPicker from './ColorPicker';

const CategoryView = () => {
  const theme = useTheme();
  const { categories, updateCategories } = useCategories();
  const [showModal, setShowModal] = useState(false);
  const [color, setColor] = useState(undefined);
  const [icono, setIcono] = useState('pen');

  const onReorderCategories = (newOrder: Categoria[]) => {
    const updatedCategories = newOrder.map((category, index) => ({
      ...category,
      ordenCategoria: index,
    }));
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

  const renderIconos = useCallback(
    ({ item, onPress }) => (
      <IconButton
        icon={item}
        size={25}
        onPress={() => onPress(item)}
        mode="contained-tonal"
        style={{ flex: 1, aspectRatio: 1, borderRadius: 50 }}
      />
    ),
    [],
  );

  return (
    <>
      <View style={styles.container}>
        <Button
          style={styles.addButton}
          icon="pen-plus"
          mode="contained"
          onPress={() => {
            console.log('abrirmodal');
            setShowModal(true);
          }}>
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
      <Portal>
        <Modal visible={showModal} onDismiss={() => setShowModal(false)}>
          <Card style={styles.cardContainer}>
            <View style={styles.topCard}>
              <IconButton
                icon={icono}
                mode="outlined"
                // containerColor=
                iconColor={color ? color : undefined}
                rippleColor={color}
                style={{ borderColor: color }}
              />
              <TextInput
                style={{ flex: 1 }}
                autoCapitalize={'sentences'}
                placeholder="Nombre Categoría"
              />
            </View>
            <Divider horizontalInset />

            <ColorPicker setColor={setColor} />
            <Divider horizontalInset />
            <ScrollView style={{ minHeight: 100, maxHeight: 400, padding: 10 }}>
              <FlatList
                data={icons}
                renderItem={({ item }) =>
                  renderIconos({
                    item,
                    onPress: setIcono,
                  })
                }
                style={{ marginBottom: 20 }}
                keyExtractor={item => item}
                numColumns={5}
                contentContainerStyle={styles.container}
              />
            </ScrollView>
          </Card>
        </Modal>
      </Portal>
    </>
  );
};
const icons = [
  'abacus',
  'access-point',
  'account',
  'account-heart',
  'airballoon-outline',
  'airplane',
  'alarm-bell',
  'alarm',
  'allergy',
  'ambulance',
  'anvil',
  'arm-flex-outline',
  'at',
  'atom',
  'audio-video',
  'axe-battle',
  'baby-carriage',
  'baby-face-outline',
  'bacteria',
  'badge-account',
  'badminton',
  'bag-personal',
  'baguette',
  'balloon',
  'bandage',
  'bank',
  'barcode',
  'barley',
  'basketball',
  'beach',
  'beaker-outline',
  'beer',
  'biathlon',
  'bicycle',
  'bird',
  'blinds',
  'book-account',
  'book-open',
  'boombox',
  'brain',
  'bread-slice-outline',
  'brush',
  'bugle',
  'bus',
  'butterfly',
  'cactus',
  'cake',
  'calculator',
  'candy',
  'car',
  'cart-outline',
  'cat',
  'charity',
  'chart-line',
  'cheese',
  'chef-hat',
  'circular-saw',
  'coffee',
  'controller-classic',
  'cupcake',
];
export default CategoryView;

const styles = StyleSheet.create({
  cardContainer: {
    width: '90%',
    alignSelf: 'center',
    minHeight: 200,
  },
  topCard: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    gap: 10,
  },
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
