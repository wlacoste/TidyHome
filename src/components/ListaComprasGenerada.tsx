import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Share,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {
  List,
  Text,
  useTheme,
  TouchableRipple,
  Icon,
  IconButton,
  Card,
  Divider,
  TextInput,
  Button,
} from 'react-native-paper';
import { IListasCompras } from './ListaCompras/ListaScreen';
import ListaAcciones from './ListaCompras/AccionesLista';

export interface ItemCompra {
  id: number;
  item: string;
  cantidad?: number;
}

interface ListaComprasProps {
  items: IListasCompras;
  onItemToggle?: (item: ItemCompra, isChecked: boolean) => void;
  agregarItem: (item: string, idLista: string, cantidad?: number) => void;
  eliminarLista: (id: string) => void;
  cambiarNombre: (nombre: string, id: string) => void;
}

const ListaCompraGenerada = ({
  items: listaItems,
  agregarItem,
  eliminarLista,
  cambiarNombre,
}: ListaComprasProps) => {
  const { id, fecha, items } = listaItems;
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [menuVisible, setMenuVisible] = useState(true);
  const [newItem, setNewItem] = useState('');
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isCambiarNombre, setCambiarNombre] = useState(false);
  const theme = useTheme();

  const toggleItem = useCallback((item: ItemCompra) => {
    setCheckedItems(prevChecked => {
      const newChecked = new Set(prevChecked);
      if (newChecked.has(item.item)) {
        newChecked.delete(item.item);
      } else {
        newChecked.add(item.item);
      }
      return newChecked;
    });
  }, []);

  const handleAddItem = useCallback(() => {
    if (newItem.trim()) {
      agregarItem(newItem.trim(), id);
      setNewItem('');
      setIsAddingItem(false);
    }
  }, [newItem, agregarItem, id]);

  const handleCambiarNombre = () => {
    console.log('cambiar nimber');
    if (nuevoNombre.trim()) {
      cambiarNombre(nuevoNombre.trim(), id);
      setNuevoNombre('');
    }
    setCambiarNombre(false);
  };
  const handleCerrarNombre = () => {
    if (nuevoNombre.trim().length === 0) {
      setCambiarNombre(false);
      setNuevoNombre('');
    }
  };

  const renderFooter = useCallback(
    () => (
      <View style={styles.footer}>
        {isAddingItem ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { color: theme.colors.onSurface }]}
              value={newItem}
              onChangeText={e => setNewItem(e)}
              placeholder="Agregar nuevo item"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              onBlur={() => Keyboard.dismiss()}
              autoFocus
            />
            <IconButton
              icon="check"
              onPress={() => handleAddItem()}
              containerColor={theme.colors.primary}
              iconColor={theme.colors.onPrimary}
            />
            <IconButton
              icon="close"
              onPress={() => setIsAddingItem(false)}
              containerColor={theme.colors.onSurface}
              iconColor={theme.colors.onPrimary}
            />
          </View>
        ) : (
          <Button
            style={[
              styles.addButton,
              { backgroundColor: theme.colors.primary, borderRadius: 8 },
            ]}
            icon="pen-plus"
            mode="contained"
            onPress={() => setIsAddingItem(true)}>
            Anotar nuevo item
          </Button>
        )}
      </View>
    ),
    [isAddingItem, newItem, theme.colors, handleAddItem],
  );

  const createShareableList = () => {
    return items
      .map(
        item =>
          `${checkedItems.has(item.item) ? '☑' : '☐'} ${item.item}${
            item.cantidad ? ` (x${item.cantidad})` : ''
          }`,
      )
      .join('\n');
  };

  const handleShare = async () => {
    const shareableList = createShareableList();
    try {
      const result = await Share.share({
        message: shareableList,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type of', result.activityType);
        } else {
          console.log('Shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <Card
        style={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}>
        <View style={styles.header}>
          <View style={styles.tituloContainer}>
            {isCambiarNombre ? (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { color: theme.colors.onSurface }]}
                  value={nuevoNombre}
                  onChangeText={e => setNuevoNombre(e)}
                  placeholder={listaItems.titulo}
                  placeholderTextColor={theme.colors.onSurfaceVariant}
                  onBlur={() => {
                    Keyboard.dismiss();
                    handleCerrarNombre();
                  }}
                  autoFocus
                />
                <IconButton
                  icon="check"
                  onPress={() => {
                    handleCambiarNombre();
                  }}
                  containerColor={theme.colors.surface}
                  iconColor={theme.colors.onBackground}
                  size={20}
                />
              </View>
            ) : (
              <>
                <TouchableRipple onPress={() => setCambiarNombre(true)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                      style={[styles.title, { color: theme.colors.onSurface }]}>
                      {listaItems.titulo}
                    </Text>
                    <IconButton
                      icon="pencil-outline"
                      containerColor={theme.colors.surface}
                      iconColor={theme.colors.onBackground}
                      size={20}
                    />
                  </View>
                </TouchableRipple>
              </>
            )}
          </View>
          <View style={styles.iconContainer}>
            <Text
              style={{
                color: theme.colors.onSurface,
                textAlignVertical: 'center',
              }}>
              {fecha}
            </Text>
            <ListaAcciones
              eliminar={() => eliminarLista(id)}
              compartir={handleShare}
            />
          </View>
        </View>
        <Divider />
        {items.map(item => {
          return (
            <TouchableRipple
              key={item.id}
              onPress={() => toggleItem(item)}
              style={{ height: 60 }}>
              <List.Item
                title={item.item}
                titleStyle={[
                  styles.itemText,
                  checkedItems.has(item.item) && styles.checkedItemText,
                  { color: theme.colors.onSurface },
                ]}
                description={
                  item.cantidad ? `Cantidad: ${item.cantidad}` : undefined
                }
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
                left={props => (
                  <List.Icon
                    {...props}
                    icon={({ size, color }) => (
                      <Icon
                        source={
                          checkedItems.has(item.item)
                            ? 'checkbox-marked'
                            : 'checkbox-blank-outline'
                        }
                        size={size}
                        color={
                          checkedItems.has(item.item)
                            ? theme.colors.primary
                            : color
                        }
                      />
                    )}
                  />
                )}
              />
            </TouchableRipple>
          );
        })}
        {renderFooter()}
      </Card>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
    paddingBottom: 0,
    margin: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tituloContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    margin: 0,
  },
  list: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
  },
  checkedItemText: {
    textDecorationLine: 'line-through',
  },
  footer: {
    padding: 16,
  },
  addButton: {
    padding: 0,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8,
  },
});

export default ListaCompraGenerada;
