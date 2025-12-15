import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, useColorScheme } from 'react-native';
import TaskInput from './TaskInput.js';
import TaskItem from './TaskItem.js';
import { connect, useSelector } from 'react-redux';

export default function TaskList({ tasks }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 To-Do List</Text>
      <TaskInput />
      <FlatList
        data={tasks}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <TaskItem item={item} index={index} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, backgroundColor: '#1E1E2F' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#FF9800', textAlign: 'center' },
  list: { paddingBottom: 80 }
});