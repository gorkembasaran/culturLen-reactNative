import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function Box({ title, bgColor, navigate }) {
  const navigation = useNavigation();

  function navigateTo(){
    if(navigate){
        navigation.navigate(navigate)  
    }
    }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <TouchableOpacity onPress={navigateTo}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 50,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  title: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
});