import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function ButtonContent({ title, navigateLink, params }) {
  const navigation = useNavigation();

  return (
    <View>
      <Button
        mode="contained"
        onPress={() => navigation.navigate(navigateLink, params)}
        style={styles.button}
      >
        {title}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
    padding: 5,
  },
});