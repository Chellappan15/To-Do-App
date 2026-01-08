import {View, Text, StyleSheet, FlatList} from "react-native";
import SortTasks from "../../components/SortTasks";
import { useContext, useEffect, useState } from "react";
import { TaskContext } from "../../context/TaskContext";
import TaskItem from "../../components/TaskItem";
import { priorityOrder } from "../../constants/constants";

export default function TaskScreen() {
    const [sortedTasks, setSortedTasks] = useState([]);
    const { tasks } = useContext(TaskContext);
    useEffect(() => {
        setSortedTasks(tasks);
    },[tasks]);
    const sortTasks = (sortOrder) => {
        let tempTasks = [...sortedTasks];
        switch (sortOrder){
            case 'oldDate':
                tempTasks.sort((a,b) => a.id - b.id);
                break;
            case 'newDate':
                tempTasks.sort((a,b) => b.id - a.id);
                break;
            case 'highPriority': 
                tempTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
                break; 
            case 'lowPriority': 
                tempTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]); 
                break;
            default: 
                break;
        }
        setSortedTasks(tempTasks);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Let's completed them</Text>
            <SortTasks sort={sortTasks}/>
            <FlatList
                data={sortedTasks}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.list}
                renderItem={({ item, index }) => (
                    <TaskItem item={item} index={index} />
                )}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyList}>
                        Seems like you have {"\n"} 
                        caught up with all tasks
                    </Text>                  
                )}
            />
        </View>
    )
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
        textAlign: 'center' 
    },
    emptyList: {
        marginTop: 2,
        color: 'white',
        fontSize: 15,
        textAlign: 'center'
    }
})