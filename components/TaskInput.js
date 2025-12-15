import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function TaskInput({ input, setInput, onAdd }) {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Add new task"
        style={styles.input}
        placeholderTextColor="#888"
      />
      <TouchableOpacity onPress={onAdd} style={styles.addButton}>
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: '#F28B82',
    padding: 12,
    borderRadius: 10,
    marginLeft: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
