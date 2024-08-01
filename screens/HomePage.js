import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Box from '../components/Box';

export default function HomePage({  }) {
  return (
    <SafeAreaView style={styles.container}>
      <Box title='Hoş geldiniz!' bgColor='#68992c' />
      <Box title='Çözmeye Başla!' navigate='ContentPage' bgColor='#d97b34' />
      <Box title='KPSS Haberleri'  bgColor='#f53649' navigate='Haberler' />
      <Box title='Tartışılan Sorular'  bgColor='#36a1a8' navigate='Topic' />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
});