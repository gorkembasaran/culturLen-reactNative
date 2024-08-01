import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, TextInput, Card } from 'react-native-paper';

export default function ContentPage({ route }) {
  const [answer, setAnswer] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Soruları</Text>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.question}>Soru 1: ...</Text>
          <TextInput
            label="Cevabınız"
            value={answer}
            onChangeText={text => setAnswer(text)}
            style={styles.input}
          />
        </Card.Content>
        <Card.Actions>
          <Button mode="contained">Cevabı Gönder</Button>
        </Card.Actions>
      </Card>
      {/* Diğer sorular için benzer kartlar */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    marginVertical: 8,
  },
  question: {
    fontSize: 18,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
});