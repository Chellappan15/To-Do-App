import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
  Modal,
  Alert,
  useColorScheme
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { Button } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import * as Notifications from "expo-notifications";
import { initializeNotifications } from '../utils/Notifications';
import registerForPushNotificationsAsync from '../utils/registerForPushNotificationsAsync';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function App() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [taskDate, setTaskDate] = useState("");
  const [mode, setMode] = useState('calendar');
  const [showCalendar, setShowCalendar] = useState(false);
  const [todayDate, setTodayDate] = useState(new Date());
  const refer = useRef({});
  useEffect(() => {
    initializeNotifications();
    const fetchTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks !== null) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Error fetching tasks', error);
      }
    };
    
    fetchTasks();
  }, []);

  const onChange = (event, selectedDate) => {
    if(mode == 'calendar' && event.type == 'set')
    {
      setTaskDate(selectedDate);
      setMode('time');
    } 
    else if(mode == 'calendar' && event.type == 'dismissed')
    {
      setShowCalendar(false);
      setInput('');
    }
    else if (mode == 'time' && event.type == 'set')
    {
      const task = new Date(taskDate);
      const selected = selectedDate;
      const completionDate = new Date(
        task.getFullYear(),
        task.getMonth(),
        task.getDate(),
        selected.getHours(),
        selected.getMinutes(),
        selected.getSeconds(),
        selected.getMilliseconds()
      );
      setMode('calendar');
      setShowCalendar(false);
      setInput("");
      scheduleNotification({ id: new Date(), title: input, completed: false, completionDate: completionDate, scheduleNotificationDate: completionDate });
      storeToMobile({ id: new Date(), title: input, completed: false, completionDate: completionDate });
    }
    else if (mode == 'time' && event.type == 'dismissed')
    {
      setMode('calendar');
      setTaskDate("");
      setShowCalendar(false);
    }
  };

  const addTask = () => {
    if (input.trim() === ''){
      setInput('');  
      return;
    } 
    else setShowCalendar(prev => !prev); setMode('calendar');
    Keyboard.dismiss();
  };
  
  const scheduleNotification = async (Task) => {
    const result = await registerForPushNotificationsAsync();
    if (result === "granted") {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: Task ? Task.title : "Hi from one of your tasks today",
          body: 'Your task is due',
          sound: 'notification.wav'
        },
        trigger: {
          channelId: 'taskNotify',
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(Task.scheduleNotificationDate)
        },
      });
    } else {
      Alert.alert(
        "Unable to schedule notification",
        "Enable the notifications permission for Expo Go in settings",
      );
    }
  }
  
  async function storeToMobile(task) {
    task = { id: task.id, title: task.title, completed: task.completed, completionDate: task['completionDate'] }
    try{
      let allTasks = [...tasks, task];
      await AsyncStorage.setItem('tasks', JSON.stringify(allTasks));
      setTasks(allTasks);
    }
    catch(err){
      console.error(err);
    }
  }

  const completeTask = async (index) => {
    try {
      const updatedTasks = tasks.map((task, indexOfItem) =>
        indexOfItem === index ? { ...task, completed: !task.completed, completedDate: new Date() } : task
      );
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTasks(updatedTasks);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (index) => {
    try {
      const updatedTasks = tasks.filter((task, indexOfItem) => indexOfItem !== index);
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setTasks(updatedTasks);
    } catch (err) {
      console.error(err);
    }
  };

  const renderLeftActions = () => {
    return (
    <View style = {styles.renderLeftActions}>
      <AntDesign name="checkcircle" size={24} color="black" style = {{paddingLeft: 10}}/>
    </View>
    )
  }

  const renderRightActions = () => {
    return (
    <View style = {styles.renderRightActions}>
      <MaterialIcons name="delete" size={26} color="black" style = {{paddingRight: 10}} />
    </View>
    )
  }

  const renderItem = ({ item, index }) => (
    <Swipeable overshootLeft = {false} overshootRight = {false} renderLeftActions={renderLeftActions} renderRightActions={renderRightActions}
    ref={(ref) => {
      refer.current[item.id] = ref;
    }}
    onSwipeableOpen={(direction) => {
        if(direction === 'left')
        {
          completeTask(index);
          refer.current[item.id].close();
        }
        else
        {
          deleteTask(index);
        }
      }
    }>
      <View style = {styles.taskItem}>
        <Text style={ item.completed ? styles.completed : styles.taskText}>
          {item.title}
        </Text>
        {/* <Text>}</Text> */}
        <Text style = {{color: 'white'}}>
          Created On: {" "} 
          {new Date(item['id']).toUTCString().replace('GMT','').split(" ").slice(0,4).join(" ")}{" "}
          {new Date(item['id']).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
          }).split(' ')[1]}
        </Text>
        <Text style = {{color: 'white'}}>
          {item.completed ? "Completed On: " : "To Be Completed On: "}
          {new Date(item[item.completed ? 'completedDate' : 'completionDate']).toUTCString().replace('GMT','').split(" ").slice(0,4).join(" ")}{" "}
          {new Date(item[item.completed ? 'completedDate' : 'completionDate']).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
          }).split(' ')[1]}
        </Text>
      </View>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style = {{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.title}>📝 To-Do List</Text>

        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Add new task"
            style={styles.input}
            placeholderTextColor={isDarkMode ? '#888' : '#666'}
          />
          <TouchableOpacity onPress={addTask} style={styles.addButton}>
            <Text style={styles.addButtonText}>＋</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          showsVerticalScrollIndicator = {false}
          data={tasks}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      </View>
      {showCalendar && 
        <DateTimePicker
          value={new Date()}
          mode={mode === 'calendar' ? 'date' : 'time'} // Change to 'time' or 'datetime' as needed
          display={mode === 'calendar' ? 'calendar' : 'clock'} // Options: 'default', 'spinner', 'calendar', 'clock'
          onChange={onChange} />
      }
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#1E1E2F'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF9800',
    textAlign: 'center',
  },
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
    elevation: 2,
    borderColor: 'black',
  },
  addButton: {
    backgroundColor: '#F28B82',
    padding: 12,
    borderRadius: 10,
    marginLeft: 10,
    elevation: 2,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 2,
    paddingBottom: 100,
    paddingTop: 2,
  },
  renderLeftActions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#00FF00',
    height: '75',
    borderRadius: 10
  },
  renderRightActions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 75,
    borderRadius: 10,
    backgroundColor: '#DC3545'
  },
  taskItem: {
    backgroundColor: '#0D1B2A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: '#3A86FF',
    borderWidth: 2,
  },
  taskText: {
    fontSize: 16,
    color: '#F0F0F0',
  },
  completed: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: '#00BCD4',
  },
});
