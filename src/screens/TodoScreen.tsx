import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
// import { ToDoItemComponent } from './components/ToDoItem';
import { ToDoItem } from '../models/productos';
import {
  getDBConnection,
  getTodoItems,
  saveTodoItems,
  createTable,
  //   clearTable,
  deleteTodoItem,
} from '../service/db-service';
import { ToDoItemComponent } from '../components/Todo/TodoItem';
import { useTodoItemCrud } from '../hooks/useTodoItems';
import { Text } from 'react-native-paper';
import TodoView from '../components/TodoView';
const App = () => {
  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {/* <View>
          {todoItems.map(todo => (
            <Text>{todo.}</Text>
            // <ToDoItemComponent
            //   key={todo.id}
            //   todo={todo}
            //   deleteItem={deleteTodoItem}
            // />
          ))}
        </View> */}
        <TodoView />
        {/* <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            value={newTodo}
            onChangeText={text => setNewTodo(text)}
          />
          <Button
            onPress={addTodo}
            title="Add ToDo"
            color="#841584"
            accessibilityLabel="add todo item"
          />
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  appTitleView: {
    marginTop: 20,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  appTitleText: {
    fontSize: 24,
    fontWeight: '800',
  },
  textInputContainer: {
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'flex-end',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    height: 30,
    margin: 10,
    // backgroundColor: 'pink',
  },
});
export default App;
