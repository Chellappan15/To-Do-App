import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, Keyboard, Modal, StyleSheet, Alert, Linking } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TaskContext } from '../context/TaskContext';
import { scheduleNotification } from '../utils/Notifications';
import { Button } from "@react-native-material/core";

export default function TaskInput() {
    const { addTask } = useContext(TaskContext);
    const [input, setInput] = useState('');
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [taskDate, setTaskDate] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [taskPriority, setTaskPriority] = useState("Low");

    const openPicker = () => {
        if (!input) return;
        setModalOpen(false);
        setShow(true);
        setMode('date');
        Keyboard.dismiss();
    };
    
    const reset = () => {
        setInput('');
        setTaskPriority('Low');
        setShow(false);
        setMode('date');
        setTaskDate(null);
    }

    const onChange = async(event, selected) => {
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
                completionDate: finalDate,
                priority: taskPriority
            };
            const notificationIdentifier = await scheduleNotification(newTask);
            if (!notificationIdentifier) {
                reset();
                Alert.alert(
                    "Unable to schedule notification", 
                    "Enable permission in settings", [
                        { text: "OK", onPress: () => Linking.openSettings() }
                    ]
                );
                return ;
            }
            addTask(newTask, notificationIdentifier);
            reset();
        }
    };

    return (
        <View style={{ flexDirection: 'row', marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
            {/* <TouchableOpacity onPress={openPicker} style={{ backgroundColor: '#F28B82', padding: 12, borderRadius: 10, marginLeft: 10 }}> */}
            <Button 
                style={{backgroundColor: '#F28B82'}}
                title="Add Task" 
                onPress={() => setModalOpen(true)} 
            />
            {/* </TouchableOpacity> */}

            {show && (
                <DateTimePicker
                    value={new Date()}
                    mode={mode}
                    display={mode === 'date' ? 'calendar' : 'clock'}
                    onChange={onChange}
                />
            )}

            <Modal
                transparent={true}
                visible={modalOpen}
                animationType="slide"
                onRequestClose={() => setModalOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Add your task</Text>
                        <TextInput
                            value={input}
                            onChangeText={setInput}
                            placeholder="What's on your mind?"
                            placeholderTextColor="#888"
                            style={{
                                width: 250,
                                borderRadius: 10,
                                borderWidth: 2,
                                borderColor: '#000000ff',
                            }}
                        />
                        <View style = {styles.priorityRow}>
                            <Text style = {{fontSize: 15, fontWeight: 600}}>Priority</Text>
                            <Picker selectedValue={taskPriority} style={styles.picker} onValueChange={(itemValue) => setTaskPriority(itemValue)}>
                                <Picker.Item label="High" value="High" />
                                <Picker.Item label="Medium" value="Medium" />
                                <Picker.Item label="Low" value="Low" />
                            </Picker>
                        </View>

                        <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={() => {
                                setModalOpen(false);
                                setTaskPriority('Low');
                            }}
                        >
                            <Text style={styles.text}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.okButton]}
                            onPress={() => openPicker()}
                        >
                            <Text style={styles.text}>OK</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        width: 300,
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 20,
        alignItems: "center",
    },
    modalTitle: { 
        fontSize: 18, 
        fontWeight: "bold", 
        marginBottom: 10 
    },
    modalMessage: { 
        fontSize: 14, 
        marginBottom: 20, 
        textAlign: "center" 
    },
    priorityRow: {
        marginTop: 5,
        width: 250,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    picker: {
        height: 60, 
        width: 150, 
        borderWidth: "20px",
        borderColor: 'white',
        backgroundColor: 'white',
        color: 'black'
    },
    buttonRow: {
        marginTop: 10, 
        flexDirection: "row", 
        justifyContent: "space-between" 
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
        padding: 12,
        borderRadius: 6,
        alignItems: "center",
    },
    cancelButton: { 
        backgroundColor: "#999" 
    },
    okButton: { 
        backgroundColor: "#2196F3" 
    },
});