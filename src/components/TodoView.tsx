import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTodoItemCrud } from '../hooks/useTodoItems';
import {
  ActivityIndicator,
  Button,
  TextInput,
  Text,
  Card,
} from 'react-native-paper';
import { formatDate } from '../utils/formatDate';
import ListaAcciones from './ListaCompras/AccionesLista';

const TodoView = () => {
  const { todoItems, addTodoItem, updateTodoItem, deleteTodoItem, isLoading } =
    useTodoItemCrud();

  const [titulo, setTitulo] = useState('Nota');
  const [nota, setNota] = useState('');

  const handleAddTodo = () => {
    if (titulo.trim() && nota.trim()) {
      const fechaNota = formatDate(new Date());
      addTodoItem(titulo, fechaNota, nota);
      setTitulo('Nota');
      setNota('');
    }
  };

  if (isLoading) {
    return <ActivityIndicator animating={true} />;
  }
  const handleShare = () => {
    console.log('hola');
  };
  return (
    <View style={styles.container}>
      {
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Nota"
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
      }

      <ScrollView style={styles.scrollView}>
        {todoItems.map(item => (
          <Card key={`${item.id}-${item.nota}`} style={styles.card}>
            <View style={styles.cardTitleContainer}>
              <Text
                style={styles.cardTitle}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.tituloNota}
              </Text>
              <ListaAcciones
                eliminar={() => deleteTodoItem(item.id)}
                compartir={handleShare}
              />
            </View>
            <Card.Content style={styles.cardContent}>
              <Text>{item.nota}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    paddingVertical: 10,
    paddingTop: 12,
    paddingRight: 4,
    height: 40,
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
