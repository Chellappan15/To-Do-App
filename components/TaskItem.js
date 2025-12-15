import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TaskItem({ item, index, onComplete, onDelete, refer }) {
  const renderLeft = () => (
    <View style={styles.left}>
      <AntDesign name="checkcircle" size={24} color="black" />
    </View>
  );
  const renderRight = () => (
    <View style={styles.right}>
      <MaterialIcons name="delete" size={26} color="black" />
    </View>
  );

  return (
    <Swipeable
      overshootLeft={false}
      overshootRight={false}
      renderLeftActions={renderLeft}
      renderRightActions={renderRight}
      ref={(ref) => (refer.current[item.id] = ref)}
      onSwipeableOpen={(dir) => {
        if (dir === 'left') {
          onComplete(index);
          refer.current[item.id].close();
        } else {
          onDelete(index);
        }
      }}
    >
      <View style={styles.taskItem}>
        <Text style={item.completed ? styles.completed : styles.text}>{item.title}</Text>
        <Text style={styles.date}>
          {item.completed ? 'Completed On: ' : 'To Be Completed On: '}
          {new Date(item.completionDate).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
          })}
        </Text>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  taskItem: {
    backgroundColor: '#0D1B2A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: '#3A86FF',
    borderWidth: 2,
  },
  text: { fontSize: 16, color: '#F0F0F0' },
  completed: { fontSize: 16, textDecorationLine: 'line-through', color: '#00BCD4' },
  left: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#00FF00',
  },
  right: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#DC3545',
  },
  date: { color: 'white', marginTop: 5 },
});
