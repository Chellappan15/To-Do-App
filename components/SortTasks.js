import { Text, StyleSheet, View, Modal, TouchableOpacity } from 'react-native'
import React, { Component, useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const SortTasks = ({sort}) => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
      <View style = {styles.container}>
        <View>
            <Text style = {styles.title}>Tasks</Text>
        </View>
        <View>
            <TouchableOpacity onPress={() => setModalVisible(prev => !prev)}>
                <FontAwesome5 name='sort-amount-down' color='white' size={30}/>
            </TouchableOpacity>
        </View>
        <Modal visible = {modalVisible} transparent = {modalVisible} animationType='slide' onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
                <View style = {styles.pickerView}>
                    <Text style={styles.pickerTitle}>Sort by</Text>
                    <View>
                        <Picker 
                            onValueChange={(value) => {
                                sort(value);
                                setModalVisible(prev => !prev);
                            }} 
                            style={styles.picker}
                        >
                            {/* Date options */}
                            <Picker.Item label="By old tasks first" value="oldDate" />
                            <Picker.Item label="By new tasks first" value="newDate" />

                            {/* Priority options */}
                            <Picker.Item label="High Priority" value="highPriority" />
                            <Picker.Item label="Low Priority" value="lowPriority" />
                        </Picker>   
                    </View>         
                </View>
            </View>
        </Modal>
      </View>
    )
}

export default SortTasks

const styles = StyleSheet.create({
    container: {
        flex: 1,
        maxHeight: 45,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    title: {
        color: 'white',
        fontSize: 20,
    },
    modalContainer: {
        padding: 20,
        backgroundColor: "rgba(0,0,0,0.5)",
        flex: 1,
        justifyContent:'center',
    },
    pickerView: {
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 10,
        backgroundColor: 'black'
    },
    pickerTitle: {
        color: 'white',
        fontSize: 20,
        borderBottomWidth: 1,
        paddingLeft: 10,
        borderBottomColor: 'white'
    },
    picker: {
        padding: 5,
    }
})