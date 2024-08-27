import React, { useState, useContext } from 'react';
import { View, StyleSheet, FlatList, Share, Clipboard } from 'react-native';
import {
  List,
  Text,
  useTheme,
  TouchableRipple,
  Icon,
  Menu,
  FAB,
  IconButton,
  Card,
  Divider,
} from 'react-native-paper';
import { IListasCompras } from './ListaCompras/ListaScreen';
import ListaAcciones from './ListaCompras/AccionesLista';
// import { MaterialCommunityIcons } from '@expo/vector-icons';

// Assume you have a ThemeContext set up in your app

export interface ItemCompra {
  id: number;
  item: string;
  cantidad?: number;
}

interface ListaComprasProps {
  items: IListasCompras;
  onItemToggle?: (item: ItemCompra, isChecked: boolean) => void;
  agregarItem: (item: string, idLista: string, cantidad?: number) => void;
}

const ListaCompraGenerada = ({
  items: listaItems,
  agregarItem,
}: ListaComprasProps) => {
  const { id, fecha, items } = listaItems;
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [menuVisible, setMenuVisible] = useState(true);
  const theme = useTheme();

  const toggleItem = (item: ItemCompra) => {
    setCheckedItems(prevChecked => {
      const newChecked = new Set(prevChecked);
      if (newChecked.has(item.item)) {
        newChecked.delete(item.item);
      } else {
        newChecked.add(item.item);
      }
      return newChecked;
    });
  };

  const renderItem = ({ item }: { item: ItemCompra }) => (
    <TouchableRipple onPress={() => toggleItem(item)} style={{ height: 60 }}>
      <List.Item
        title={item.item}
        titleStyle={[
          styles.itemText,
          checkedItems.has(item.item) && styles.checkedItemText,
          { color: theme.colors.onSurface },
        ]}
        description={item.cantidad ? `Cantidad: ${item.cantidad}` : undefined}
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
                  checkedItems.has(item.item) ? theme.colors.primary : color
                }
              />
            )}
          />
        )}
      />
    </TouchableRipple>
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

  const handleCopyToClipboard = () => {
    const shareableList = createShareableList();
    Clipboard.setString(shareableList);
  };

  return (
    <Card
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          Lista de compras
        </Text>
        <View style={styles.iconContainer}>
          <Text
            style={{
              color: theme.colors.onSurface,
              textAlignVertical: 'center',
            }}>
            {fecha}
          </Text>
          <ListaAcciones />
        </View>
      </View>
      <Divider />
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.item}
        style={styles.list}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    margin: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    margin: 0,
  },
  list: {
    flex: 1,
    // height: 20,
  },
  itemText: {
    fontSize: 16,
  },
  checkedItemText: {
    textDecorationLine: 'line-through',
  },
});

export default ListaCompraGenerada;
