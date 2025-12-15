import React from 'react';
import { View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function SwipeActions({ type, width, height }) {
    return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: type === 'left' ? 'flex-start' : 'flex-end',
                    backgroundColor: type === 'left' ? '#00ff00' : '#dc3545',
                    borderRadius: 10,
                    marginBottom: 15
                }}
            >
            {type === 'left' && <AntDesign name="checkcircle" size={24} style={{ paddingLeft: 10 }} />}
            {type === 'right' && <MaterialIcons name="delete" size={26} style={{ paddingRight: 10 }} />}
        </View>
    );
}
