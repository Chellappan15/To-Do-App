import React, { useContext, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { TaskContext } from '../context/TaskContext';
import SwipeActions from './SwipeActions';

export default function TaskItem({ item, index }) {
    const { toggleComplete, deleteTask } = useContext(TaskContext);

    const ref = useRef(null);

    const handleSwipe = direction => {
        if (direction === 'left') {
            toggleComplete(index);
            ref.current.close();
        } else deleteTask(index);
    };

    return (
        <Swipeable
            ref={ref}
            overshootLeft={false}
            overshootRight={false}
            renderLeftActions={() => <SwipeActions type="left" />}
            renderRightActions={() => <SwipeActions type="right" />}
            onSwipeableOpen={handleSwipe}
        >
            <View style={styles[item.priority]}>
                <Text style={item.completed ? styles.completed : styles.text}>
                    {item.title}
                </Text>

                <Text style={styles.meta}>
                    Created On: {new Date(item.id).toUTCString().replace('GMT', '').split(' ').slice(0, 4).join(' ')}
                </Text>

                <Text style={styles.meta}>
                    {item.completed ? "Completed On: " : "To Be Completed On: "}
                    {new Date(new Date(item[item.completed ? 'completedDate' : 'completionDate']).getTime() + (5.5 * 60 * 60 * 1000)).toUTCString().replace("GMT", "").split(" ").slice(0, 5).join(" ")}
                </Text>
            </View>
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    High: { 
        backgroundColor: '#F44336', 
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 15, 
        borderColor: '#ffffffff', 
        borderWidth: 2 
    },
    Medium: {
        backgroundColor: '#FFB300', 
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 15, 
        borderColor: '#ffffffff', 
        borderWidth: 2 
    },
    Low: {
        backgroundColor: '#4CAF50', 
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 15, 
        borderColor: '#ffffffff', 
        borderWidth: 2 
    },
    text: { 
        fontSize: 16, 
        color: '#212121' 
    },
    completed: { 
        fontSize: 16, 
        color: '#212121', 
        textDecorationLine: 'line-through' 
    },
    meta: { 
        color: '#212121',
        marginTop: 5 
    }
});
