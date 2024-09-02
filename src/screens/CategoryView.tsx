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
  TextInput,
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
  const { categories, updateCategories, addCategory } = useCategories();
  const [showModal, setShowModal] = useState(false);
  const [showModalColor, setShowModalColor] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState<Categoria>({
    id: 0,
    isEnabled: true,
    icon: 'pen',
    color: '',
    name: '',
    ordenCategoria: categories.length,
  });
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
    Categoria | undefined
  >(undefined);

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
  const updateIcono = (icono: string) => {
    setNuevaCategoria(prev => ({ ...prev, icon: icono }));
  };
  const updateColorCat = (color: string) => {
    setNuevaCategoria(prev => ({ ...prev, color: color }));
  };

  const handleNewCategory = async () => {
    await addCategory(nuevaCategoria);
    setNuevaCategoria({
      id: 0,
      isEnabled: true,
      icon: 'pen',
      color: '',
      name: '',
      ordenCategoria: categories.length,
    });
  };
  const updateColor = (color: string) => {
    if (!categoriaSeleccionada) {
      return;
    }
    const categoriaActualizada = { ...categoriaSeleccionada, color: color };
    setCategoriaSeleccionada(undefined);
    updateCategories(
      categories.map(item =>
        item.id !== categoriaActualizada.id ? item : categoriaActualizada,
      ),
    );
    setShowModalColor(false);
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
              <View style={[styles.icon]}>
                <IconButton
                  icon={item.icon}
                  size={24}
                  onPress={() => {}}
                  mode="outlined"
                  iconColor={item.color ? item.color : undefined}
                  style={{
                    borderColor: item.color ? item.color : theme.colors.outline,
                  }}
                />
              </View>
            </View>
          )}
          right={() => (
            <View style={styles.rightContainer}>
              <TouchableOpacity
                onPress={() => {
                  setCategoriaSeleccionada(item);
                  setShowModalColor(true);
                }}
                style={{
                  borderWidth: 1,
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: item.color
                    ? item.color
                    : theme.colors.surface,
                  borderColor: theme.colors.outline,
                }}
              />
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
          <Card style={[styles.cardContainer, { marginTop: 50 }]}>
            <View style={styles.topCard}>
              <IconButton
                icon={nuevaCategoria.icon}
                mode="outlined"
                iconColor={
                  nuevaCategoria.color ? nuevaCategoria.color : undefined
                }
                rippleColor={
                  nuevaCategoria.color ? nuevaCategoria.color : undefined
                }
                style={{
                  borderColor: nuevaCategoria.color
                    ? nuevaCategoria.color
                    : theme.colors.outline,
                }}
              />
              <TextInput
                style={{ flex: 1 }}
                autoCapitalize={'sentences'}
                placeholder="Nombre Categoría"
                value={nuevaCategoria.name}
                onChangeText={text =>
                  setNuevaCategoria(prevState => ({
                    ...prevState,
                    name: text,
                  }))
                }
              />
            </View>
            {/* </SafeAreaView> */}
            <Divider horizontalInset />
            <ColorPicker setColor={updateColorCat} />
            <Divider horizontalInset />
            <ScrollView
              style={{
                minHeight: 100,
                maxHeight: 300,
                padding: 10,
                paddingBottom: 0,
              }}>
              <FlatList
                data={icons}
                renderItem={({ item }) =>
                  renderIconos({
                    item,
                    onPress: updateIcono,
                  })
                }
                style={{ marginBottom: 20 }}
                keyExtractor={item => item}
                numColumns={5}
                contentContainerStyle={styles.Categorycontainer}
              />
            </ScrollView>
            <Button
              style={styles.addButtonModal}
              icon="pen-plus"
              mode="contained"
              disabled={nuevaCategoria.name == ''}
              onPress={() => {
                handleNewCategory();
                setShowModal(false);
              }}>
              Agregar categoría
            </Button>
          </Card>
        </Modal>

        <Modal
          visible={showModalColor}
          onDismiss={() => setShowModalColor(false)}>
          <Card style={styles.cardColores}>
            <Card.Title title="Seleccionar Color" />
            <ColorPicker setColor={updateColor} />
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
  cardColores: {
    width: '90%',
    alignSelf: 'center',
    minHeight: 100,
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
  Categorycontainer: {
    flex: 1,
    marginBottom: 0,
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
    width: 70,
    display: 'flex',
    justifyContent: 'space-between',
  },
  addButton: {
    alignItems: 'center',
    margin: 16,
    borderRadius: 8,
  },
  addButtonModal: {
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 0,
    // paddingTop: 0,
    borderRadius: 8,
  },
  addButtonText: {
    fontWeight: 'bold',
  },
});
