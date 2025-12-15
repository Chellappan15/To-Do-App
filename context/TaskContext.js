import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { init, addNewTask } from '../constants/constants';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const Dispatch = useDispatch();

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        const stored = await AsyncStorage.getItem('tasks');
        if(stored) {
            setTasks(JSON.parse(stored));
            Dispatch({type: init, payload: JSON.parse(stored)});
        }
    };

    const saveTasks = async updated => {
        setTasks(updated);
        await AsyncStorage.setItem('tasks', JSON.stringify(updated));
    };

    const addTask = task => {
        const updatedTask = {
            ...task,
            completedDate: task.completedDate ? task.completedDate.toISOString() : null,
            completionDate: task.completionDate ? task.completionDate.toISOString() : null
        };

        saveTasks([...tasks, updatedTask]);
        Dispatch({ type: addNewTask, payload: updatedTask });
    };

    const deleteTask = index => {
        const updated = tasks.filter((_, i) => i !== index);
        saveTasks(updated);
    };

    const toggleComplete = index => {
        const updated = tasks.map((task, i) =>
            i === index ? { ...task, completed: !task.completed, completedDate: new Date() } : task
        );
        saveTasks(updated);
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, deleteTask, toggleComplete }}>
            {children}
        </TaskContext.Provider>
    );
};
