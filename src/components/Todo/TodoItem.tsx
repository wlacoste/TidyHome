import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { ToDoItem } from '../../models/productos';
export const ToDoItemComponent: React.FC<{
  todo: ToDoItem;
  deleteItem: Function;
}> = ({ todo: { id, value }, deleteItem }) => {
  return (
    <View style={styles.todoContainer}>
      <View style={styles.todoTextContainer}>
        <Text style={styles.sectionTitle}>{value}</Text>
      </View>
      <Button
        onPress={() => deleteItem(id)}
        title="done"
        color="#841584"
        accessibilityLabel="add todo item"
      />
    </View>
  );
};
const styles = StyleSheet.create({
  todoContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 12,
    // backgroundColor: 'deepskyblue',
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    // borderColor: 'black',
    borderWidth: 1,
  },
  todoTextContainer: {
    width: '90%',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '400',
  },
});
