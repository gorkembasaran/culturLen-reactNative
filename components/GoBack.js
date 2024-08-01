import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import React from 'react'
import { useNavigation } from '@react-navigation/native';

export default function GoBack() {
    const navigation = useNavigation()
  return (
    <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
        <Ionicons name='chevron-back' size={30} color='black' />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    backButton : {
        position : 'absolute',
        top : 80,
        left : 20
    }
})