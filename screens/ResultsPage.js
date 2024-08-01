import React, { useEffect } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import { getAuth } from 'firebase/auth';
import { getUserDataFromFirestore, updateUserStats } from '../operations/firestoreOperations';

export default function ResultsPage({ route, navigation }) {
  const { results } = route.params;
  const correctAnswersCount = results.filter(result => result.isCorrect).length;
  const solvedQuestionsCount = results.length;

  useEffect(() => {
    const currentUser = getAuth().currentUser;
    if (currentUser) {
      const userId = currentUser.uid;
      getUserDataFromFirestore(userId).then(userData => {
        const newSolvedQuestions = (userData.solvedQuestions || 0) + solvedQuestionsCount;
        const newCorrectAnswers = (userData.correctAnswers || 0) + correctAnswersCount;
        updateUserStats(userId, newSolvedQuestions, newCorrectAnswers);
      });
    }
  }, [results]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sonuçlar</Text>
      <Text style={styles.resultText}>Doğru Cevap Sayısı: {correctAnswersCount}</Text>
      <Text style={styles.resultText}>Yanlış Cevap Sayısı: {solvedQuestionsCount - correctAnswersCount}</Text>
      <FlatList
        data={results}
        keyExtractor={(item) => item.questionId}
        renderItem={({ item, index }) => (
          <View style={styles.resultItem}>
            <Text style={styles.questionIndex}>Soru {index + 1}</Text>
            <Text style={styles.result}>{item.isCorrect ? 'Doğru' : 'Yanlış'}</Text>
          </View>
        )}
      />
      <Button mode="contained" onPress={() => navigation.navigate('Anasayfa')} style={styles.backButton}>
        Ana Sayfaya Dön
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultText: {
    fontSize: 18,
    marginBottom: 10,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  questionIndex: {
    fontSize: 16,
  },
  result: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
  },
});