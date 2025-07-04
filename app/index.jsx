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
  Alert
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

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [success, setSuccess] = useState(false);
  const refer = useRef({});
  useEffect(() => {
    initializeNotifications();
    const fetchTasks = async () => {
      try {
        // scheduleNotification();
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
  
  const scheduleNotification = async () => {
    const result = await registerForPushNotificationsAsync();
    console.log("Permission: ", result);
    if (result === "granted") {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "I'm a notification from your app! 📨",
        },
        trigger: {
          seconds: 5,
        },
      });
    } else {
      Alert.alert(
        "Unable to schedule notification",
        "Enable the notifications permission for Expo Go in settings",
      );
    }
  }
  
  const addTask = () => {
    if (input.trim() === '') return;
    setInput('');  
    Keyboard.dismiss();
    storeToMobile({ id: new Date(), title: input, completed: false });
  };
  async function storeToMobile(task) {
    try{
      let allTasks = [...tasks, task];
      await AsyncStorage.setItem('tasks', JSON.stringify(allTasks));
      setTasks([...tasks, { id: new Date(), title: input, completed: false }]);
      setSuccess((prev) => !prev);
      console.log(await AsyncStorage.getItem('tasks'));
    }
    catch(err){
      console.error(err);
    }
  }

  const completeTask = async (index) => {
    try {
      const updatedTasks = tasks.map((task, indexOfItem) =>
        indexOfItem === index ? { ...task, completed: !task.completed, id: new Date() } : task
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
        <Text style = {{color: 'white'}}>{item.completed ? "Completed On: " : "Created On: "}{
        new Date(item['id']).toUTCString().replace('GMT','').split(" ").slice(0,4).join(" ")}{" "}
        {new Date(item['id']).toLocaleString('en-IN', {
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
            />
            <TouchableOpacity onPress={addTask} style={styles.addButton}>
              <Text style={styles.addButtonText}>＋</Text>
            </TouchableOpacity>
          </View>
          <Button onPress={scheduleNotification} buttonColor='white'>Press me</Button>

          <FlatList
            showsVerticalScrollIndicator = {false}
            data={tasks}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
          />
        </View>
        {success && <Modal visible = {true}transparent = {true} animationType = 'fade'>
                      <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128, 128, 128, 0.5)'}}>
                        <Button 
                          icon = {() => <Entypo name='thumbs-up' color='white' size={20}/>} 
                          mode = 'contained' 
                          buttonColor='#00C853' 
                          onPress={() => setSuccess((prev) => !prev)}>Added Successfully
                        </Button>
                      </View>
                    </Modal>}
      </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F9F9F9',
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
    // borderWidth: 2
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
    // backgroundColor: 'black'
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
