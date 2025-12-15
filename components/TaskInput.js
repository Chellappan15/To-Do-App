import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, Keyboard } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TaskContext } from '../context/TaskContext';
import { scheduleNotification } from '../utils/Notifications';

export default function TaskInput() {
    const { addTask } = useContext(TaskContext);
    const [input, setInput] = useState('');
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [taskDate, setTaskDate] = useState(null);

    const openPicker = () => {
        if (!input.trim()) return;
        setShow(true);
        setMode('date');
        Keyboard.dismiss();
    };

    const onChange = (event, selected) => {
        if (!selected) {
            setShow(false);
            return;
        }
        
        if (mode === 'date' && event.type === 'dismissed' || mode === 'time' && event.type === 'dismissed') {
            setInput('');
            setShow(false);
            setTaskDate(null);
            setMode('date');
            return ;
        }

        if (mode === 'date') {
            setTaskDate(selected);
            setMode('time');
        }
        if (mode === 'time') {
            const finalDate = new Date(
                taskDate.getFullYear(),
                taskDate.getMonth(),
                taskDate.getDate(),
                selected.getHours(),
                selected.getMinutes()
            );

            const newTask = {
                id: Date.now(),
                title: input,
                completed: false,
                completionDate: finalDate
            };

            addTask(newTask);
            scheduleNotification(newTask);

            setInput('');
            setShow(false);
            setMode('date');
            setTaskDate(null);
        }
    };

    return (
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Add new task"
                style={{
                    flex: 1,
                    backgroundColor: '#FFF',
                    paddingVertical: 12,
                    paddingHorizontal: 15,
                    borderRadius: 10
                }}
            />
            <TouchableOpacity onPress={openPicker} style={{ backgroundColor: '#F28B82', padding: 12, borderRadius: 10, marginLeft: 10 }}>
                <Text style={{ color: '#FFF', fontSize: 20 }}>＋</Text>
            </TouchableOpacity>

            {show && (
                <DateTimePicker
                    value={new Date()}
                    mode={mode}
                    display={mode === 'date' ? 'calendar' : 'clock'}
                    onChange={onChange}
                />
            )}
        </View>
    );
}
