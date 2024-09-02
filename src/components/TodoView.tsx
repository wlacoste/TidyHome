import React, { useRef, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Share,
} from 'react-native';
import { ITodoItem, useTodoItemCrud } from '../hooks/useTodoItems';
import {
  ActivityIndicator,
  Button,
  TextInput,
  Text,
  Card,
  IconButton,
  useTheme,
  Divider,
} from 'react-native-paper';
import { formatDate } from '../utils/formatDate';
import ListaAcciones from './ListaCompras/AccionesLista';
import { TextInput as TextInputNative } from 'react-native';
interface EditingItem extends ITodoItem {
  editedTituloNota: string;
  editedNota: string;
}

const TodoView = () => {
  const { todoItems, addTodoItem, updateTodoItem, deleteTodoItem, isLoading } =
    useTodoItemCrud();
  const theme = useTheme();
  const [nota, setNota] = useState('');
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);

  const handleAddTodo = () => {
    if (nota.trim()) {
      const lines = nota.trim().split('\n');
      let titulo = 'Nota';
      let contenido = nota.trim();

      const MAX_TITLE_LENGTH = 40;

      if (lines.length > 1 && lines[0].length <= MAX_TITLE_LENGTH) {
        titulo = lines[0].trim();
        contenido = lines.slice(1).join('\n').trim();
      }

      const fechaNota = formatDate(new Date(), true);
      addTodoItem(titulo, fechaNota, contenido);
      setNota('');
    }
  };

  const handleEditItem = (item: ITodoItem) => {
    setEditingItem({
      ...item,
      editedTituloNota: item.tituloNota,
      editedNota: item.nota,
    });
  };

  if (isLoading) {
    return <ActivityIndicator animating={true} />;
  }

  const handleShare = async (item: ITodoItem) => {
    const message = `${item.tituloNota}: \n ${item.nota}`;
    try {
      const result = await Share.share({
        message: message,
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
  const handleSaveEdit = () => {
    if (editingItem) {
      updateTodoItem(
        editingItem.id,
        editingItem.editedTituloNota,
        editingItem.fechaNota,
        editingItem.editedNota,
      );
      setEditingItem(null);
    }
  };

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
    setEditingItem(null);
  };
  return (
    <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={'Nota:\n' + 'Escribe tu nota aquí...'}
            value={nota}
            onChangeText={setNota}
            multiline
            numberOfLines={10}
            style={[styles.noteInput]}
            mode="outlined"
            contentStyle={styles.noteInputContent}
          />
          <Button
            mode="contained"
            icon="pen-plus"
            onPress={handleAddTodo}
            style={styles.submitButton}>
            Guardar Nota
          </Button>
        </View>

        <ScrollView style={styles.scrollView}>
          {todoItems.map(item => (
            <Card key={`${item.id}-${item.nota}`} style={styles.card}>
              <View style={styles.cardTitleContainer}>
                {editingItem && editingItem.id === item.id ? (
                  <>
                    <TextInputNative
                      style={[
                        styles.tituloInput,
                        {
                          color: theme.colors.onSurface,
                          borderColor: theme.colors.outline,
                          backgroundColor: theme.colors.background,
                        },
                      ]}
                      value={editingItem.editedTituloNota}
                      onChangeText={text =>
                        setEditingItem({
                          ...editingItem,
                          editedTituloNota: text,
                        })
                      }
                    />
                    <View style={{ flex: 1 }}>
                      <Text>{''}</Text>
                    </View>
                  </>
                ) : (
                  <Text
                    style={styles.cardTitle}
                    numberOfLines={1}
                    onPress={() => handleEditItem(item)}
                    ellipsizeMode="tail">
                    {item.tituloNota}
                  </Text>
                )}
                <Text numberOfLines={1} ellipsizeMode="tail">
                  {item.fechaNota}
                </Text>
                {editingItem && editingItem.id === item.id ? (
                  <IconButton
                    icon="content-save"
                    size={20}
                    onPress={handleSaveEdit}
                  />
                ) : (
                  <ListaAcciones
                    eliminar={() => deleteTodoItem(item.id)}
                    compartir={() => handleShare(item)}
                  />
                )}
              </View>
              <Divider />
              <TouchableOpacity onPress={() => handleEditItem(item)}>
                {editingItem && editingItem.id === item.id ? (
                  <View style={[styles.cardContent, { padding: 0, margin: 0 }]}>
                    <TextInput
                      style={{
                        paddingVertical: 10,
                      }}
                      contentStyle={{
                        width: '100%',
                      }}
                      mode="outlined"
                      value={editingItem.editedNota}
                      onChangeText={text =>
                        setEditingItem({ ...editingItem, editedNota: text })
                      }
                      multiline
                    />
                  </View>
                ) : (
                  <Card.Content style={styles.cardContent}>
                    <Text style={{ fontSize: 16 }}>{item.nota}</Text>
                  </Card.Content>
                )}
              </TouchableOpacity>
            </Card>
          ))}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,

    flexGrow: 1,
    minHeight: '100%',
  },
  tituloInput: {
    height: 35,
    padding: 0,
    paddingHorizontal: 8,
    fontSize: 17,
    fontWeight: '700',
    borderRadius: 3,
    borderWidth: 0.8,
  },
  addButton: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  submitButton: {
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
    display: 'flex',
    gap: 10,
    minHeight: 500,
  },
  noteInputContent: {
    paddingTop: 8,
    textAlignVertical: 'top',
  },
  todoItem: {
    fontSize: 16,
    marginBottom: 8,
    padding: 8,
    borderRadius: 4,
  },
  noteInput: {
    marginBottom: 8,
    height: 200,
  },
  noteInputText: {
    maxHeight: 200,
    textAlignVertical: 'top',
  },
  card: {
    marginBottom: 8,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 5,
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 4,
    height: 45,

    // alignContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  cardTitleRight: {
    fontSize: 14,
  },
  cardContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
});

export default TodoView;
